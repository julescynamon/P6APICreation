const mongoose = require('mongoose');

// Creation d'un schema de donnee pour la base de donnee de nos sauces

const saucesShema = mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        defaut: 0,
        required: true
    },
    dislikes: {
        type: Number,
        defaut:0,
        required: true
    },
    usersLiked: {
        type: [String],
        required: true
    },
    usersDisliked: {
        type: [String],
        required: true
    },

});




module.exports = mongoose.model('Sauce', saucesShema);