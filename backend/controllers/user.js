const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cryptojs = require('crypto-js');

require('dotenv').config();

// Middleware pour enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            const user = new User({

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

    const researchCryptMail = cryptojs.HmacSHA256(req.body.email, process.env.KEY_EMAIL_SECRET).toString();
    User.findOne({
            email: researchCryptMail
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    res.status(200).json({
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