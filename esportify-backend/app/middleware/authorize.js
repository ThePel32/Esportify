const jwt = require("jsonwebtoken");
require('dotenv').config();

const authorize = (roles = []) => {
    return (req, res, next) => {
        console.log("🔍 Vérification du rôle dans authorize.js :", req.user);

        if (!req.user) {
            return res.status(403).send({ message: "Accès interdit, utilisateur non authentifié." });
        }

        if (roles.length && !roles.includes(req.user.role.toLowerCase())) {
            console.log("❌ Accès refusé - Rôle insuffisant :", req.user.role);
            return res.status(403).send({ message: "Forbidden: You don't have access!" });
        }

        next();
    };
};

module.exports = authorize;
