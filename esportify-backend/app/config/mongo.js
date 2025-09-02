const mongoose = require('mongoose');
const { URI } = require('./mongo.config');

mongoose.connect(URI)
    .then(() => console.log('MongoDB connecté avec succès'))
    .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

module.exports = mongoose;
