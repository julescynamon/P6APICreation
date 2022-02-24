const express = require('express');
const router = express.Router();
const validPassword = require('../middlewares/passwordValidator');
const emailValid = require('../middlewares/emailValidator');
const limitConnect = require('../middlewares/connexionParams');
const userControls = require('../controllers/user');

// Mise en place des chemins d'acces au routes
// Route pour l'inscription
router.post('/signup', emailValid, validPassword, userControls.signup);
// Route pour la connexion
router.post('/login', limitConnect, userControls.login);



module.exports = router;