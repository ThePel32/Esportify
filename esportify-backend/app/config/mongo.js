const mongoose = require('mongoose');
const { URI } = require('./mongo.config');

const url = process.env.MONGO_URI || URI;

if (url) {
    mongoose.connect(url)
        .then(() => console.log('MongoDB connecté avec succès'))
        .catch(err => console.error('Erreur de connexion à MongoDB:', err));
} else {
    console.log('MONGO_URI absent → Mongo non initialisé (c’est voulu).');
}

module.exports = mongoose;
