const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({message: "No token provided!"});
    }
    jwt.verify(token, '1a2z3e4r5t6y7u8i9o0p', (err, decoded) => {
        if(err){
            return res.status(401).send({message: "Unauthorized!"});
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;