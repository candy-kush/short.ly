const express = require("express");
const { urlShortenerController } = require('../../controllers');
const router = express.Router();

router.route("/").post(urlShortenerController.openCompression);

module.exports = router;
