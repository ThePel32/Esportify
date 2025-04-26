const express = require("express");
const router = express.Router();
const events = require("../controllers/events.controller.js");
const verifyToken = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");
const eventController = require('../controllers/events.controller');


router.post("/", authorize(["admin", "organizer"]), events.create);

router.get("/", events.findAll);

router.get("/:id", events.findOne);

router.put("/:id", authorize(["organizer", "admin"]), events.update);

// router.post('/:id/join', authorize, events.confirmJoin);

router.delete("/:id", authorize(["admin"]), events.delete);
router.delete("/", authorize(["admin"]), events.deleteAll);

router.put("/:id/validate", authorize(["admin"]), events.validate);

router.post("/:id/join", verifyToken, authorize(["user", "organizer", "admin"]), events.joinEvent);
router.post("/:id/confirm-join", verifyToken, authorize(["user", "organizer", "admin"]), events.confirmJoin);
router.post("/:id/join", verifyToken, authorize(["user", "organizer", "admin"]), events.joinEvent);
router.post("/:id/leave", verifyToken, authorize(["user", "organizer", "admin"]), events.leaveEvent);
router.delete("/:id/kick/:userId", verifyToken, authorize(["admin", "organizer"]), events.kickParticipant);
router.patch("/:id/start", verifyToken, authorize(["organizer", "admin"]), events.startEvent);

// Routes "history"
router.get("/history", events.getHistory);
router.get("/history/user/:userId", events.getUserHistory);
router.get("/history/all", authorize(["admin", "organizer", "user"]), events.getAllEndedEvents);

// Routes générales
router.post("/", authorize(["admin", "organizer"]), events.create);
router.get("/", events.findAll);
router.put("/:id", authorize(["organizer", "admin"]), events.update);
router.delete("/:id", authorize(["admin"]), events.delete);
router.delete("/", authorize(["admin"]), events.deleteAll);
router.put("/:id/validate", authorize(["admin"]), events.validate);
router.patch("/auto-start", eventController.autoStartEvents);

// Route dynamique CATCH-ALL en dernier
router.get("/:id", events.findOne);

module.exports = router;
