const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, favoritesController.addFavorite);
router.delete('/:gameKey', verifyToken, favoritesController.removeFavorite);
router.get('/', verifyToken, favoritesController.getFavoritesByUser);

module.exports = router;
