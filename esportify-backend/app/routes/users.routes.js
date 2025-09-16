const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth.controller.js");
const users = require("../controllers/users.controller.js");

const verifyToken = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");

router.post('/signup', (req, res, next) => {
    console.log('[routes] POST /api/users/signup');
    return auth.signup(req, res, next);
});

router.post('/login', (req, res, next) => {
    console.log('[routes] POST /api/users/login');
    return auth.login(req, res, next);
});

router.post('/refresh-token', verifyToken, (req, res, next) => {
    console.log('[routes] POST /api/users/refresh-token');
    return auth.refreshToken(req, res, next);
});

router.get('/profile', verifyToken, (req, res, next) => {
    console.log('[routes] GET /api/users/profile');
    return auth.getUserProfile(req, res, next);
});

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
