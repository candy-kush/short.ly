const httpStatus = require("http-status");
const { AppError, hashUrl, getShortCode } = require("../utils");
const { redisClient, pool } = require("../configs");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const openCompression = async (req) => {
  try {
    console.log("inside openCompression method, request body: ", req.body);
    if (!req.body || !req.body.longUrl) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid Request");
    }

    const { longUrl } = req.body;

    let attempt = 0;
    const MAX_ATTEMPTS = parseInt(process.env.MAX_COLLISION_RESOLUTION_ATTEMPT);
    let hashedUrl, shortCode, salt = "";

    while (attempt < MAX_ATTEMPTS) {
        salt = attempt === 0 ? "" : uuidv4();
        hashedUrl = await hashUrl(longUrl, salt);
        shortCode = getShortCode(hashedUrl, 7 + attempt);

        const existingLongUrl = await redisClient.get(`shortCode:${shortCode}`);
        if (existingLongUrl === longUrl) {
            console.log("Existing URL: ", existingLongUrl);
            break;
        }

        if (!existingLongUrl) {
            try {
                const id = uuidv4();
                const timestamp = moment().toISOString();
                await pool.query(
                    `INSERT INTO urls (id, short_code, long_url, created_at) VALUES ($1, $2, $3, $4)`,
                    [id, shortCode, longUrl, timestamp]
                );

                await redisClient.set(`shortCode:${shortCode}`, longUrl, {
                    EX: process.env.REDIS_LONG_URL_EXPIRE_DURATION * 60,
                });

                break;

            } catch (error) {
                console.log("error occured: ", error);
                if (error.code == '23505') continue;
                else throw new AppError(500, "Something went wrong");
            }
        }
        attempt++;
    }

    if (attempt === MAX_ATTEMPTS) {
        throw new AppError(500, "Too many collisions. Please try again.");
    }

    return {
      code: 200,
      shortUrl: `${process.env.SHORTLY_BASE_URL}/${shortCode}`,
    };

  } catch (error) {
    console.error("error occurred in openCompression: ", error);
    throw new AppError(error.statusCode || 500, error.message || "Something went wrong");
  }
};

const redirectController = async(req) => {
    try {
        const { shortCode } = req.params;
        console.log("inside redirectController method, request params: ", { shortCode });
        if(!shortCode) throw new AppError(httpStatus.status.BAD_REQUEST, "Invalid Request");

        let longUrl = await redisClient.get(`shortCode:${shortCode}`);
        if(!longUrl) {
            console.log("Fallback to DB");
            const result = await pool.query('SELECT long_url FROM urls WHERE short_code = $1', [shortCode]);
            if (result?.rowCount > 0) {
                longUrl = result.rows[0].long_url;
                await redisClient.set(`shortCode:${shortCode}`, longUrl, {
                    EX: process.env.REDIS_LONG_URL_EXPIRE_DURATION * 60,
                });
            }
        }

        console.log("Long URL: ", longUrl);
        if(!longUrl) throw new AppError(httpStatus.status.NOT_ACCEPTABLE, "Requested URL no longer exist");

        return {
            code: 200,
            url: longUrl
        };
        
    } catch (error) {
        console.log("error occured in redirectController: ", error);
        throw new AppError(error.statusCode || 500, error.message || "Something went wrong, please try again");
    }
};

module.exports = {
    openCompression,
    redirectController,
};