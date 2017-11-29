'use strict';

const staticCache = require('koa-static-cache');

module.exports = app => {
  app.use(staticCache('/dist/js'));
  app.use(staticCache('/dist/css'));
};
