// Import de multer
const multer = require('multer');

// Mise en place d'un middleware avec multer qui est un  package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP

// dictionnaire d'extensions à traduire
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* objet de configuration(qui comprend 
2 éléments : destination, et filename) de multer 
que l'on passe à la méthode diskStorage */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // génère nom du fichier, élimine les espaces avec split et join
        const name = file.originalname.split(' ').join('_');
        // accès mimetype (ex: image/png) appelé par notre dictionnaire
        const extension = MIME_TYPES[file.mimetype];
        //  génère un nom, ajout d'un time-stamp et extension
        callback(null, name + Date.now() + '.' + extension);
    },
    //  génère une limite de taille (ici ) pour les photos telecharger sécurise un peu plus l'API
    limits: {
        fileSize: 2097152
    }
});

// export du middleware multer configuré en passant l'objet storage,avec single pour un fichier image unique 
module.exports = multer({
    storage: storage
}).single('image');