const express = require("express");
const { urlShortenerController } = require('../../controllers');
const router = express.Router();

router.route("/:shortCode").get(urlShortenerController.redirectController);

module.exports = router;
