const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).send({ message: "Aucun token fourni !" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).send({ message: "Format de token non valide !" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Token non autorisé ou expiré !" });
        }

        req.user = { id: decoded.id, role: decoded.role.toLowerCase() };
        req.userId = decoded.id;

        next();
    });
};

module.exports = verifyToken;
