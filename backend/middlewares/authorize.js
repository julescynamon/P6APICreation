const jwt = require('jsonwebtoken');

require('dotenv').config();

// Mise ne place d'un middleware d'authentification par token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            res.status(403).json({
                error: newError('403: unauthorized request')
            });
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid credentials')
        });
    }
};