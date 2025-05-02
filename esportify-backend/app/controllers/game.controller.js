const Game = require("../models/game.model.js");

exports.create = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Le contenu ne peut pas être vide!"
        });
    }

    const game = new Game({
        name: req.body.name,
        pegi: req.body.pegi,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        image_path: req.body.image_path,
        gender: req.body.gender
    });

    Game.create(game, (err, data) => {
        if(err)
            return res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création du jeu."
    });
    else res.send(data);
    });
};

exports.findAll = (req, res) => {
    const name = req.query.name;

    Game.getAll(name, (err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la récupération des jeux."
        });
        else res.send(data);
    });
};

exports.findOne =  (req, res) => {
    Game.findById(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Jeu non trouvé avec l'id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Erreur lors de la récupération du jeu avec l'id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Le contenu ne peut pas être vide!"
        });
    }

    Game.updateById(
        req.params.id,
        new Game(req.body),
        (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    return res.status(404).send({
                        message: `Jeu non trouvé avec l'id ${req.params.id}.`
                    });
                } else {
                    return res.status(500).send({
                        message: "Erreur lors de la mise à jour du jeu avec l'id" + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

exports.delete = (req, res) => {
    Game.remove(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Jeu non trouvé avec l'id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Impossible de supprimer le jeu avec l'id" + req.params.id
                });
            }
        } else res.send({message: `Jeu supprimé avec succès!`});
    });
};

exports.deleteAll = (req, res) => {
    Game.removeALl((err, data) => {
        if(err)
            return res.status(500).send({
        message: err.message || "Une erreur est survenue lors de la suppression de tout les événements."
        });
        else res.send({message: `Tous les jeux ont été supprimés avec succès!`});
    });
};