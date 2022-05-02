const { parse } = require("json2csv");
const { writeFile, chown } = require("fs").promises;

const toCsv = async (data, outputDirectory, fileName, options = {}) => {
  const file = `${outputDirectory}/${fileName}`;
  const csvData = parse(data, { delimiter: options.delimiter || "," });

  await writeFile(file, options.utf8Bom === true ? "\ufeff" + csvData : csvData, "utf8");

  if (options.owner) {
    await chown(file, options.owner.uid, options.owner.gid);
  }
};
module.exports.toCsv = toCsv;
