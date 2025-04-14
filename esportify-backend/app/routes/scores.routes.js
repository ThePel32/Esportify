const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/score.controller');

router.post('/', scoreController.addScore);

router.get('/event/:eventId', scoreController.getScoresForEvent);

router.get ('/event/:eventId/top', scoreController.getTopScoresForEvent);

router.get('/event/:eventId/user/:userId', scoreController.getScoreForUser);

module.exports = router;