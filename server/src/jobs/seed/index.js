const { runScript } = require("../scriptWrapper");
const { seedSample } = require("../../common/model");

runScript(async ({ db }) => {
  await seedSample(db);
});
