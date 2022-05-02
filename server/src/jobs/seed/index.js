const { runScript } = require("../scriptWrapper");
const seedSample = require("./seed");

runScript(async ({ db }) => {
  await seedSample(db);
});
