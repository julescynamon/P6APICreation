const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cryptojs = require('crypto-js');
require('dotenv').config();


exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.pasword, 10)
        .then(hash => {

            const user = new User({

                email: cryptojs.HmacSHA256(req.body.email, process.env.KEY_EMAIL_SECRET).toString(),
                pasword: hash

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

exports.login = (req, res, next) => {



};