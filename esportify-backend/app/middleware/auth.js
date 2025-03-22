const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
    console.log("🔍 Vérification du token en cours...");

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        console.log("❌ Aucun token reçu !");
        return res.status(403).send({ message: "No token provided!" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        console.log("❌ Format du token invalide !");
        return res.status(403).send({ message: "Invalid token format!" });
    }

    console.log("🔍 Tentative de vérification du token :", token);
    console.log("🔑 Clé secrète utilisée pour vérifier le token :", process.env.JWT_SECRET);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("❌ Erreur de validation du token :", err.message);
            return res.status(401).send({ message: "Unauthorized or token expired!" });
        }

        req.user = { id: decoded.id, role: decoded.role.toLowerCase() };

        console.log("✅ Utilisateur authentifié dans verifyToken :", req.user);

        next();
    });
};

module.exports = verifyToken;
