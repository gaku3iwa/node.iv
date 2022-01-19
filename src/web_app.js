const express = require("express");
const web_app = express();
const path = require(`path`);
const WEBAPP_PORT_NUMBER = 946;
const $src = `[app_web]`;

// ----------------------------------------------------------------------------
// WebApp Server
exports.init = () => {
  server_body();
};

// ----------------------------------------------------------------------------
//
const server_body = () => {
  web_app
    .use(express.urlencoded({ extended: false }))
    .use(express.json())
    .use((req, res, next) => {
      console.log(`${$src} ----+----1----+----2----+----3----+----4----+----5`);
      console.log(`${$src} http verb   : ${req.method.toUpperCase()}`);
      console.log(`${$src} http body   : ${JSON.stringify(req.body)}`);
      console.log(`${$src} http params : ${JSON.stringify(req.params)}`);
      console.log(`${$src} http query  : ${JSON.stringify(req.query)}`);
      console.log(`${$src} http url    : ${req.url}`);
      next();
    })
    // ------------------------------------------------------------------------
    //
    // ------------------------------------------------------------------------
    .use(express.static(path.join(__dirname, `..`, `docs`)))
    .listen(WEBAPP_PORT_NUMBER, () => {
      console.log(`running webapp listening on port ${WEBAPP_PORT_NUMBER}`);
    });
};
