const { connectToMongo } = require("../mongodb");

module.exports = async (options = {}) => {
  return {
    db: options.db || (await connectToMongo()).db,
  };
};
