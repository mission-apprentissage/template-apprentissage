/* eslint-disable node/no-unpublished-require */
const axiosist = require("axiosist");
const createComponents = require("../../src/common/components/components");
const server = require("../../src/http/server");

let startServer = async (options = {}) => {
  let components = await createComponents({});

  let app = await server(components);
  let httpClient = axiosist(app);

  return {
    httpClient,
    components,
  };
};

module.exports = (desc, cb) => {
  describe(desc, function () {
    cb({ startServer });
  });
};
