const logger = require("../../common/logger");
const { runScript } = require("../scriptWrapper");
const { SampleEntity } = require("../../common/model");

runScript(async ({ db }) => {
  const sampleToAdd = new SampleEntity({
    nom: "Test Sample",
    valeur: "Valeur exemple",
  });
  await sampleToAdd.save();
  logger.info(`Sample '${sampleToAdd.nom}' / '${sampleToAdd.valeur}' successfully added in db ${db.name}`);
});
