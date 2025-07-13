const httpStatus = require("http-status");
const { urlShortenerService } = require("../services/index");

const openCompression = async (req, res) => {
  try {
    const response = await urlShortenerService.openCompression(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const redirectController = async (req, res) => {
  try {
    const response = await urlShortenerService.redirectController(req);
    res.status(httpStatus.status.MOVED_PERMANENTLY).redirect(response.url);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

module.exports = {
  openCompression,
  redirectController,
};
