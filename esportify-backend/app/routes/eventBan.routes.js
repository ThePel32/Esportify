const express = require('express');
const router = express.Router();
const eventBanController = require('../controllers/eventBan.controller');

router.get('/', eventBanController.getAllBans);
router.post('/:eventId/ban/:userId', eventBanController.banUserFromEvent);
router.get('/:eventId/is-banned/:userId', eventBanController.checkIfUserBanned);
router.get('/:eventId/banned', eventBanController.getBannedUsers);
router.delete('/:eventId/unban/:userId', eventBanController.unbanUser);


module.exports = router;
