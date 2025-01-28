const express = require("express");
const router = express.Router();
const shop = require("../controllers/shop.controller.js");

router.post("/", shop.create);
router.get("/", shop.findAll);
router.get("/:id", shop.findOne);
router.put("/:id", shop.update);
router.delete("/:id", shop.delete);
router.delete("/", shop.deleteAll);

module.exports = router;