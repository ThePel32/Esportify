const express = require("express");
const router = express.Router();
const events = require("../controllers/events.controller.js");

router.post("/", events.create);
router.get("/", events.findAll);
router.get("/:id", events.findOne);
router.put("/:id", events.update);
router.delete("/:id", events.delete);
router.delete("/", events.deleteAll);

module.exports = router;