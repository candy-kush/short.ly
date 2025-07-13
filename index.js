require("dotenv").config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const httpContext = require('express-http-context');
const moment = require('moment');
const chalk = require('chalk');
const routes = require('./src/routes/v1/index');
const redirectRoutes = require('./src/routes/v1/redirect.routes');
const { requestRateLimiter } = require("./src/middlewares");

const PORT = process.env.PORT || 5001;

const app = express();

app.use(httpContext.middleware);

app.use((req, res, next) => {
  const reqId = Math.floor(1000000 + Math.random() * 9000000);
  const ip = req.headers['x-forwarded-for'] || req.ip;
  httpContext.set('reqId', reqId);
  httpContext.set('ip', ip);
  next();
});

const originalLog = console.log;
console.log = async (...args) => {
  const reqId = httpContext.get('reqId') || 'NOT_DEFINED';
  const ip = httpContext.get('ip') || 'UNKNOWN';
  const timestamp = moment().toISOString();
  const stack = new Error().stack;
  const callerLine = stack.split('\n')[2]?.trim();

  const prefix = `${chalk.red(`[${reqId}]`)} ${chalk.cyan(timestamp)} - ${chalk.bgWhite(ip)}`;

  originalLog(`${prefix} ${chalk.magenta(callerLine)}`, ...args);
};


app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use(cors());

app.use(requestRateLimiter);

app.use('/apis/v1', routes);

app.use('/', redirectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
