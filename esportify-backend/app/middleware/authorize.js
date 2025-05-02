const jwt = require("jsonwebtoken");
require('dotenv').config();

const authorize = (roles = []) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(403).send({ message: "Accès interdit, utilisateur non authentifié." });
        }

        if (roles.length && !roles.includes(req.user.role.toLowerCase())) {
            return res.status(403).send({ message: "Accès interdit : Vous n'avez pas accès !" });
        }

        next();
    };
};

module.exports = authorize;
