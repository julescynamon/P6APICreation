const Sauce = require('../models/sauces');
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {

    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch ((error) => res.status(404).json({
            error
        }));

};

