// Importation du package 'validator'
const validator = require("validator"); 


//  Middleware de vérification de l'adresse mail et exportation
module.exports = function (req, res, next) {
    // Si l'adresse mail n'est pas valide
    if (!validator.isEmail(req.body.email)) {
        return response
            .status(400)
            .json({
                message: "Veuillez saisir une adresse mail valide !"
            });
    } else {
        next();
    }
};