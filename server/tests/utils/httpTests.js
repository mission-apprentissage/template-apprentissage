/* eslint-disable node/no-unpublished-require */
const axiosist = require("axiosist");
const { connectToMongoForTests, cleanAll } = require("./testUtils.js");
const server = require("../../src/http/server");

const startServer = async () => {
  const app = await server();
  const httpClient = axiosist(app);
  await connectToMongoForTests();

  return {
    httpClient,
  };
};

module.exports = (desc, cb) => {
  describe(desc, function () {
    cb({ startServer });
    afterEach(cleanAll);
  });
};
