const csvToJson = require("convert-csv-to-json");

const readJsonFromCsvFile = (localPath) => {
  return csvToJson.getJsonFromCsv(localPath);
};
module.exports.readJsonFromCsvFile = readJsonFromCsvFile;
