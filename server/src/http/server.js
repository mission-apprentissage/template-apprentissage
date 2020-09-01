const express = require("express");
const config = require("config");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const apiKeyAuthMiddleware = require("./middlewares/apiKeyAuthMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const packageJson = require("../../package.json");
const helloRoute = require("./routes/helloRoute");
const entityRoute = require("./routes/entityRoute");
const securedRoute = require("./routes/securedRoute");

module.exports = async (components) => {
  const { db } = components;
  const app = express();

  app.use(bodyParser.json());
  app.use(corsMiddleware());
  app.use(logMiddleware());

  app.use("/api/helloRoute", helloRoute());
  app.use("/api/entity", entityRoute());
  app.use("/api/secured", apiKeyAuthMiddleware, securedRoute());

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await db
        .collection("sampleEntity")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        name: `Serveur MNA - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.get(
    "/api/config",
    tryCatch(async (req, res) => {
      return res.json({
        config: config,
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};
