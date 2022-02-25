// import de jsonwebtoken
const jwt = require('jsonwebtoken');

// mise en place de DotEnv pour recuperer les clefs secrete sans avoir a les mettres dans le code en dur.
require('dotenv').config();

// Mise ne place d'un middleware d'authentification par token et exportation du module
module.exports = (req, res, next) => {
    try {
        // récupère le token dans le header authorization
        // split retourne un tableau avec bearer en 0 et le token en 1 
        const token = req.headers.authorization.split(' ')[1];
        // décoder le token avec verify en utilisant ma variable d'environement
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        // récupère le userId du token
        const userId = decodedToken.userId;
        // ajout de le userId du token à l'objet requête
        req.auth = {
            userId
        };
        // vérifier que le userId de la requête correspond à celui du token
        if (req.body.userId && req.body.userId !== userId) {
            res.status(403).json({
                error: newError('403: accès refusé ')
            });
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('utilisateur non authentifié')
        });
    }
};