const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');

router.post('/', favoritesController.addFavorite);

router.delete('/', favoritesController.removeFavorite);

router.get('/:userId', favoritesController.getFavoritesByUser);

module.exports = router;
