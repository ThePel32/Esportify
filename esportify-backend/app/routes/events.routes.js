const express = require("express");
const router = express.Router();
const events = require("../controllers/events.controller.js");
const verifyToken = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");


router.post("/", authorize(["admin", "organizer"]), events.create);

router.get("/", events.findAll);

router.get("/:id", events.findOne);

router.put("/:id", authorize(["organizer", "admin"]), events.update);

// router.post('/:id/join', authorize, events.confirmJoin);

router.delete("/:id", authorize(["admin"]), events.delete);
router.delete("/", authorize(["admin"]), events.deleteAll);

router.put("/:id/validate", authorize(["admin"]), events.validate);

router.post("/:id/join", authorize(["user", "organizer", "admin"]), events.joinEvent);
router.post("/:id/confirm-join", authorize(["user", "organizer", "admin"]), events.confirmJoin);

router.post("/:id/leave", authorize(["user", "organizer", "admin"]), events.leaveEvent);

router.delete("/:id/remove/:userId", authorize(["admin"]), events.removeParticipant);

module.exports = router;
