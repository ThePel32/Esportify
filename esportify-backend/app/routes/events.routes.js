const express = require("express");
const router = express.Router();
const events = require("../controllers/events.controller.js");
const verifyToken = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");
const eventController = require('../controllers/events.controller');

router.post("/", verifyToken, authorize(["admin", "organizer"]), events.create);
router.get("/", events.findAll);
router.get("/:id", events.findOne);
router.put("/:id", verifyToken, authorize(["organizer", "admin"]), events.update);
router.delete("/:id", verifyToken, authorize(["admin"]), events.delete);
router.delete("/", verifyToken, authorize(["admin"]), events.deleteAll);

router.put("/:id/validate", verifyToken, authorize(["admin"]), events.validate);
router.patch("/:id/start", verifyToken, authorize(["organizer", "admin"]), events.startEvent);
router.patch("/auto-start", eventController.autoStartEvents);

router.post("/:id/join", verifyToken, authorize(["user", "organizer", "admin"]), events.joinEvent);
router.post("/:id/confirm-join", verifyToken, authorize(["user", "organizer", "admin"]), events.confirmJoin);
router.post("/:id/leave", verifyToken, authorize(["user", "organizer", "admin"]), events.leaveEvent);
router.delete("/:id/kick/:userId", verifyToken, authorize(["admin", "organizer"]), events.kickParticipant);

router.get("/history", events.getHistory);
router.get("/history/user/:userId", events.getUserHistory);
router.get("/history/all", verifyToken, authorize(["admin", "organizer", "user"]), events.getAllEndedEvents);

module.exports = router;
