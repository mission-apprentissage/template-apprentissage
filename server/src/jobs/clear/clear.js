const logger = require("../../common/logger");
const { Sample } = require("../../common/model/index");

module.exports = async () => {
  logger.info("test");
  await Sample.deleteMany({});
  logger.info(`All Samples deleted`);
};
