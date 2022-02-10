const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Models du schema d'un user qu'on doit retrouver dans la base de donnees
const userShema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

// Mise en place du pluggin unique validator pour empecher plusieurs users d'avoir la meme adresse mail
userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);