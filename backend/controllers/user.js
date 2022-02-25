// import du shema model user
const User = require("../models/user");
// import du package de cryptage bcrypt
const bcrypt = require('bcrypt')
// import du package de token
const jwt = require('jsonwebtoken')
// import du package de cryptage cryptojs pour plus de securite pour le mail
const cryptojs = require('crypto-js');

require('dotenv').config();

// Middleware pour enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {

    // crypter le mdp avec hash, 10 tours.
    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            const user = new User({
                // crypter le mail avec cryptojs pour plus de securite
                email: cryptojs.HmacSHA256(req.body.email, process.env.KEY_EMAIL_SECRET).toString(),
                password: hash

            });
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};


// Middleware pour authentifier un utilisateur en mettant en place un token
exports.login = (req, res, next) => {

    // je recherche mon mail crypter
    const researchCryptMail = cryptojs.HmacSHA256(req.body.email, process.env.KEY_EMAIL_SECRET).toString();
    // trouver l'utilisateur dans la BDD
    User.findOne({
            email: researchCryptMail
        })
        .then(user => {
            // verifier si trouvé un user ou non
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            // comparer le mdp avec le hash enregistré dans le user
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    res.status(200).json({
                        /* vérifier le token à chaque fois avec la fonction 
                        sign (payload, clé secrete pour encodage, config expiration)*/
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id
                            },
                            process.env.SECRET_TOKEN, {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};