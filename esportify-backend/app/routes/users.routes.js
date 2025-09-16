const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth.controller.js");
const users = require("../controllers/users.controller.js");

const verifyToken = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/refresh-token', verifyToken, auth.refreshToken);
router.get('/profile', verifyToken, auth.getUserProfile);

router.get('/organizers', verifyToken, users.findAllOrganizers);
router.patch('/:id/password', users.updatePassword);

router.get('/all', verifyToken, authorize(["admin"]), users.findAll);
router.patch("/:id/role", verifyToken, authorize(["admin"]), users.updateRole);
router.post("/", verifyToken, authorize(["admin"]), users.create);
router.get("/:id", verifyToken, authorize(["admin"]), users.findOne);
router.put("/:id", verifyToken, authorize(["admin"]), users.update);
router.delete("/:id", verifyToken, authorize(["admin"]), users.delete);
router.delete("/", verifyToken, authorize(["admin"]), users.deleteAll);

module.exports = router;
