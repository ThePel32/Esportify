const express = require("express");
const router = express.Router(); 
const users = require("../controllers/users.controller.js");

router.post('/signup', users.signup);
router.post('/login', users.login);
router.post('/logout', users.logout);
// router.post('/forgot-password', users.forgotPassword);
// router.post('/reset-password', users.forgotPassword);
router.get('/profile', users.getUserProfile);

router.post("/", users.create);
router.get("/", users.findAll);
router.get("/:id",  users.findOne);
router.put("/:id", users.update);
router.delete("/:id", users.delete);
router.delete("/", users.deleteAll);

module.exports = router;
