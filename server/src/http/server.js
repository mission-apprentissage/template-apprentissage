const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const packageJson = require("../../package.json");
const helloRoute = require("./routes/helloRoute");

// eslint-disable-next-line no-unused-vars
module.exports = async (components) => {
  const app = express();

  app.use(bodyParser.json());

  // Add needed middlewares here
  app.use(logMiddleware());

  app.use("/api/helloRoute", helloRoute());

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      return res.json({
        name: `Serveur MNA - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
      });
    })
  );

  // Example getConfig endpoint
  app.get(
    "/getConfig",
    tryCatch(async (req, res) => {
      return res.json(config);
    })
  );

  app.use(errorMiddleware());

  return app;
};
