const Sauce = require('../models/sauces');
const fs = require('fs');

// Middleware pour recuperer toutes les sauces enregistrer
exports.getAllSauces = (req, res, next) => {

    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({
            error
        }));

};

// Middleware pour recuperer une sauce en particulier
exports.getOneSauce = (req, res, next) => {

    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({
            error
        }));

};

// Middleware pour creer une sauce sur le site 
exports.createSauce = (req, res, next) => {

    const sauceModel = JSON.parse(req.body.sauce);
    delete sauceModel._id;
    const sauce = new Sauce({

        ...sauceModel,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],

    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));

};

// Middleware pour modifier une sauce deja presente dans la base de donnee et appartenant bien au meme userId
exports.updateSauce = (req, res, next) => {

    const sauceModel = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceModel,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));

};

// Middleware pour supprimer une sauce deja presente dans la base de donnee et appartenant bien au meme userId
exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));

};


// Middleware pour gerer les likes et dislikes de mon application
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    switch (like) {
        // premier cas l'utilisateur mais un like a la sauce
        case 1:
            Sauce.updateOne({
                    _id: sauceId
                }, {
                    $push: {
                        usersLiked: userId
                    },
                    $inc: {
                        likes: +1
                    }
                })
                .then(() => res.status(200).json({
                    message: `L'utilisateur aime la sauce`
                }))
                .catch((error) => res.status(400).json({
                    error
                }))

            break;

        case 0:
            // deuxieme cas l'utilisateur mais 0 like a la sauce
            Sauce.findOne({
                    _id: sauceId
                })
                // Si dans le tableau j'aime il y a deja un userId j'enleve un like
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({
                                _id: sauceId
                            }, {
                                $pull: {
                                    usersLiked: userId
                                },
                                $inc: {
                                    likes: -1
                                }
                            })
                            .then(() => res.status(200).json({
                                message: `L'utilisateur reste neutre`
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }))
                    }
                    // Si dans le tableau je n'aime pas il y a deja un userId j'enleve un dislike
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({
                                _id: sauceId
                            }, {
                                $pull: {
                                    usersDisliked: userId
                                },
                                $inc: {
                                    dislikes: -1
                                }
                            })
                            .then(() => res.status(200).json({
                                message: `L'utilisateur reste neutre`
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }))
                    }
                })
                .catch((error) => res.status(404).json({
                    error
                }))
            break;

        case -1:
            // troisieme cas l'utilisateur met un dislike a la sauce
            Sauce.updateOne({
                    _id: sauceId
                }, {
                    $push: {
                        usersDisliked: userId
                    },
                    $inc: {
                        dislikes: +1
                    }
                })
                .then(() => {
                    res.status(200).json({
                        message: `Je n'aime pas`
                    })
                })
                .catch((error) => res.status(400).json({
                    error
                }))
            break;

        default:
            console.log(error);
    }
}