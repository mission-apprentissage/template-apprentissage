const logger = require("../../common/logger");
const { Sample, User } = require("../../common/model/index");

module.exports = async () => {
  try {
    await Sample.deleteMany({});
    await User.deleteMany({});
    logger.info(`All Samples deleted`);
    logger.info(`All users deleted`);
  } catch (err) {
    logger.info("test");
  }
};
