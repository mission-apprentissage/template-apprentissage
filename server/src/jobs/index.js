const { runScript } = require("./scriptWrapper");
const logger = require("../common/logger");

runScript(async ({ db }) => {
  try {
    logger.info(`Start all jobs`);
 
  } catch (error) {
    logger.error(error);
  }
});
