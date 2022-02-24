// Importation du package 'express-rate-limit'
const rateLimit = require('express-rate-limit');


// Middleware pour limiter les tentatives de connexion infructueuses répétées
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 10, // Limite chaque IP à 10 requêtes par `window` (ici, par 15 minutes) 
    standardHeaders: true, // Limite de taux de retour info dans les en-têtes `RateLimit-*` 
    legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
    message: "Votre compte est bloqué pendant 15 minutes suite à 3 tentatives infructueuses !",
});

// Exportations
module.exports = limiter;