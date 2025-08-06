const mongoose = require("mongoose");
const { URI } = require("./mongo.config");

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connécté avec succès"))
    .catch(err => console.error("Erreur de connexion à MongoDB:", err));

module.exports = mongoose;