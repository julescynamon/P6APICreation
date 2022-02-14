// Mise en place de notre application express
const express = require('express');
// Mise en place de la base de donnee Mongoose
const mongoose = require('mongoose');
// Mise en place du package Helmet pour pour pouvoir respecter les standars de securite
const helmet = require('helmet');
// mise en place du package path pour accéder au path de notre serveur
const path = require('path');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// mise en place de DotEnv pour recuperer les clefs secrete sans avoir a les mettres dans le code en dur.
require('dotenv').config();


// Connection a la base de donnee grace au pluggin mongoose
mongoose.connect(process.env.SECRET_MONGOOSE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Lancement de Express
const app = express();

// Utilisation de Helmet pour respecter les standars de securite, Helmet nous aide à protéger notre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
app.use(helmet());

// Prévention des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

//intercerpte les requetes de type json et donne accès au corps de la requète remplace body-parser
app.use(express.json());

// Misen place des connexions aux routes
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;