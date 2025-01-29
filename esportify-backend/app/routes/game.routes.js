const express = require("express");
const router = express.Router();
const game = require("../controllers/game.controller.js");

router.post("/", game.create);
router.get("/", game.findAll);
router.get("/:id", game.findOne);
router.put("/:id", game.update);
router.delete("/:id", game.delete);
router.delete("/", game.deleteAll);

module.exports = router;