const express = require('express');
const urlShortenerRoute = require('./url-shortener.routes');

const router = express.Router();

const contextRoutes = [
  {
    path: '/url',
    route: urlShortenerRoute,
  },
];

contextRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;