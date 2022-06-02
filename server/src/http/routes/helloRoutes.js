import express from "express";
import logger from "../../common/logger.js";
import { tryCatch } from "../middlewares/tryCatchMiddleware.js";

/**
 * Sample route module for displaying hello message
 */
export default () => {
  const router = express.Router();

  router.get(
    "/api/hello",
    tryCatch(async (req, res) => {
      logger.info("Hello World");
      return res.json({
        message: "Hello World",
      });
    })
  );

  return router;
};
