const Game = require("../models/game.model.js");

exports.create = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Content can not be empty!"
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
        message: err.message || "Some error occurred while creating the game."
    });
    else res.send(data);
    });
};

exports.findAll = (req, res) => {
    const name = req.query.name;

    Game.getAll(name, (err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving games."
        });
        else res.send(data);
    });
};

exports.findOne =  (req, res) => {
    Game.findById(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Not found Game with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving Game with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Game.updateById(
        req.params.id,
        new Game(req.body),
        (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    return res.status(404).send({
                        message: `Not found Game with id ${req.params.id}.`
                    });
                } else {
                    return res.status(500).send({
                        message: "Error updating Game with id" + req.params.id
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
                    message: `Not found Game with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete Game with id " + req.params.id
                });
            }
        } else res.send({message: `Game was deleted successfully!`});
    });
};

exports.deleteAll = (req, res) => {
    Game.removeALl((err, data) => {
        if(err)
            return res.status(500).send({
        message: err.message || "Some error occurred while removing all games."
        });
        else res.send({message: `All Games were deleted successfully!`});
    });
};