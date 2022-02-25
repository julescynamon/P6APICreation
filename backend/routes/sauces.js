// import d'express
const express = require('express');
// création d'un router 
const router = express.Router();
// import middleware multer pour le traitement des images à télécharger
const multer = require('../middlewares/multer');
// import middleware d'authentification
const auth = require('../middlewares/authorize');
// import des controllers
const saucesControls = require('../controllers/sauces');

// Mise en place des chemins d'acces au routes en incluant les middleware Multer et authorize

router.get("/", auth, saucesControls.getAllSauces);
router.get("/:id", auth, saucesControls.getOneSauce);
router.post("/", auth, multer, saucesControls.createSauce);
router.put("/:id", auth, multer, saucesControls.updateSauce);
router.delete("/:id", auth, saucesControls.deleteSauce);
router.post("/:id/like", auth, saucesControls.likeDislikeSauce);

// export du router
module.exports = router;