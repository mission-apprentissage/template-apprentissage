const express = require("express");
const config = require("config");
const logger = require("../../common/logger");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const logicModule = require("../../logic/logicModule");

module.exports = () => {
  const router = express.Router();

  router.get(
    "/",
    tryCatch(async (req, res) => {
      const msg = logicModule.getTestMessage("Test");
      logger.info(msg);
      return res.json({
        message: msg,
      });
    })
  );

  router.get(
    "/getConfig",
    tryCatch(async (req, res) => {
      return res.json({
        config: config,
      });
    })
  );

  return router;
};
