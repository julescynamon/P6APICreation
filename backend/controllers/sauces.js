// import du modèle de Sauce
const Sauce = require('../models/sauces');
// Mise en place du package fs pour interagir avec le système de fichiers du serveur.
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
    // récupérer les champs dans le corps de la requête
    const sauceModel = JSON.parse(req.body.sauce);
    // nouvelle Sauce
    const sauce = new Sauce({
        ...sauceModel,
        // résolution de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    // enregistrer l'objet dans la BDD avec une promesse
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

    // opérateur ternaire pour vérifier si fichier image existe ou non
    const sauceModel = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    Sauce.findOneAndUpdate({
            _id: req.params.id
        }, {
            ...sauceModel,
            _id: req.params.id
        })
        .then((sauce) => {
            if (sauce.userId == req.auth.userId) {
                // On fais en sorte de bien supprimer l'ancienne image avant de mettre la nouvelle
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw error
                })
                res.status(200).json({
                    message: "Sauce modifiée !"
                })
            } else {
                alert('requète non authorysé')
            }
        })
        .catch((error) => res.status(400).json({
            error
        }));
};

// Middleware pour supprimer une sauce deja presente dans la base de donnee et appartenant bien au meme userId
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            // Je verifie que l'on trouve bien la sauce et que c'est bien l'utilisateur qui supprime sa sauce
            if (!sauce) {
                res.status(404).json({
                    error: new Error('Sauce non trouvée !')
                });
            }
            if (req.auth.userId!==sauce.userId  ) {
                res.status(400).json({
                    error: new Error('Requête non autorisée !')
                });
            }

            const filename = sauce.imageUrl.split('/images/')[1];
            // supprime le fichier puis effectue le callback qui supprime de la BDD
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    }).then(
                        () => {
                            res.status(200).json({
                                message: 'Supprimé !'
                            });
                        })
                    .catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
            });
        })


};


// Middleware pour gerer les likes et dislikes de mon application
exports.likeDislikeSauce = (req, res, next) => {

    // récupère le champs likes
    let like = req.body.like;
    // récupère le userId
    let userId = req.body.userId;
    // récupère l'id de l'URL
    let sauceId = req.params.id;

    switch (like) {
        // premier cas l'utilisateur mais un like a la sauce
        case 1:
            // Mise a jour de la base de donnee 
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
                }));

            break;

        case 0:
            // deuxieme cas l'utilisateur mais 0 like a la sauce
            Sauce.findOne({
                    _id: sauceId
                })
                // Si dans le tableau j'aime il y a deja un userId j'enleve un like
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) {
                        // Mise a jour de la base de donnee
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
                                message: "Suppression du like"
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    };
                    // Si dans le tableau je n'aime pas il y a deja un userId j'enleve un dislike
                    if (sauce.usersDisliked.includes(userId)) {
                        // Mise a jour de la base de donnee
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
                                message: "Suppression du dislike"
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    };
                })
                .catch((error) => res.status(404).json({
                    error
                }))
            break;

        case -1:
            // troisieme cas l'utilisateur met un dislike a la sauce
            // Mise a jour de la base de donnee
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
                }));
            break;

        default:
            console.log(error);
    };
};