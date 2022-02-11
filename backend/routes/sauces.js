const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const auth = require('../middlewares/authorize');

const saucesControls = require('../controllers/sauces');

// Mise en place des chemins d'acces au routes en incluant les middleware Multer et authorize

router.get("/", auth, saucesControls.getAllSauces);
router.get("/:id", auth, saucesControls.getOneSauce);
router.post("/", auth, multer, saucesControls.createSauce);
router.put("/:id", auth, multer, saucesControls.updateSauce);
router.delete("/:id", auth, saucesControls.deleteSauce);
router.post("/:id/like", auth, saucesControls.likeDislikeSauce);


module.exports = router;