const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth.controller.js");
const verifyToken = require("../middleware/auth.js");
const authorize = require("../middleware/authorize.js");

function usersCtl() {
    return require("../controllers/users.controller.js");
}

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

router.get('/organizers', verifyToken, (req, res, next) => usersCtl().findAllOrganizers(req, res, next));
router.patch('/:id/password', (req, res, next) => usersCtl().updatePassword(req, res, next));
router.get('/all', verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().findAll(req, res, next));
router.patch("/:id/role", verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().updateRole(req, res, next));
router.post("/", verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().create(req, res, next));
router.get("/:id", verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().findOne(req, res, next));
router.put("/:id", verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().update(req, res, next));
router.delete("/:id", verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().delete(req, res, next));
router.delete("/", verifyToken, authorize(["admin"]), (req, res, next) => usersCtl().deleteAll(req, res, next));

module.exports = router;
