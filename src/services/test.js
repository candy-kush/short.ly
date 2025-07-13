const { compress, PostGresPool, RedisConnect } = require('shortly-utils');

PostGresPool({
    username: "postgres",
    password: "postGre$",
    host: "localhost",
    database: "shortly",
    port: 5432,
});

RedisConnect({url: 'redis://localhost:6379'});

const func = async() => {
    const compressed = await compress({ longUrl: "https://console.cloud.google.com/apis/dashboard?authuser=1&inv=1&invt=Ab1hkQ&project=cwg-5472d16e-23c2-43&pli=1" });
    console.log("Compressed: ", compressed);
};

func();