const serve = require('koa-static');

module.exports = app => {
  app.use(serve(__dirname));
};
