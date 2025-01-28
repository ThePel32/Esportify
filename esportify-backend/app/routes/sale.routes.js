const express = require("express");
const router = express.Router(); 
const sale = require("../controllers/sale.controller.js");

router.post("/", sale.create);
router.get("/", sale.findAll);
router.get("/:id", sale.findOne);
router.put("/:id", sale.update);
router.delete("/:id", sale.delete);
router.delete("/", sale.deleteAll);

module.exports = router;