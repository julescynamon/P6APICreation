// import express
const express = require('express');
// creer un routeur
const router = express.Router();
// validation mot de passe
const validPassword = require('../middlewares/passwordValidator');
// validation email
const emailValid = require('../middlewares/emailValidator');
// middleware pour limité le nombre de tentative de connexion
const limitConnect = require('../middlewares/connexionParams');
// import du controller du user
const userControls = require('../controllers/user');

// Mise en place des chemins d'acces au routes
// Route pour l'inscription
router.post('/signup', emailValid, validPassword, userControls.signup);
// Route pour la connexion
router.post('/login', limitConnect, userControls.login);


// exporter ce router
module.exports = router;