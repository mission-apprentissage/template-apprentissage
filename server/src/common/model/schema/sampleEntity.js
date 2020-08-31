const { Schema } = require("mongoose");

module.exports = new Schema({
  nom: {
    type: String,
    default: null,
    description: "Nom de l'entité d'exemple",
  },
  valeur: {
    type: String,
    default: null,
    description: "Valeur de test",
  },
});
