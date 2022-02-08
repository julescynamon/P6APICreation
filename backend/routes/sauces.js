const express = require('express');
const router = express.Router();
const saucesControls = require('../controllers/sauces');
const auth = require('../middlewares/authorize');

router.get("/", auth, saucesControls.getAllSauces);
// router.get("/:id", auth, saucesControls.getOneSauce);
// router.post("/", auth, multer, saucesControls.createSauce);
// router.put("/:id", auth, multer, saucesControls.updateSauce);
// router.delete("/:id", auth, saucesControls.deleteSauce);
// router.post("/:id/like", auth, saucesControls.likeDislikeSauce);


module.exports = router;