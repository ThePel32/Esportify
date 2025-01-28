const Sale = require("../models/sale.model.js");

exports.create = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const sale = new Sale({
        date: req.body.date,
        gameGender: req.body.gameGender,
        gameName: req.body.gameName,
        quantity: req.body.quantity
    });

    Sale.create(sale, (err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the sale."
            });
        else res.send(data);
    });
};

exports.findAll =(req, res) => {
    const date = req.query.date;

    Sale.getAll(date, (err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving sale."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Sale.findById(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Not found sale with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving sale with id " + req.params.id
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

    Sale.updateById(
        req.params.id,
        new Sale(req.body),
        (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    return res.status(404).send({
                        message: `Not found sale with id ${req.params.id}.`
                    });
                } else {
                    return res.status(500).send({
                        message: "Error updating sale with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

exports.delete = (req, res) => {
    Sale.remove(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Not found sale with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete sale with id " + req.params.id
                });
            }
        } else res.send({message: `Sale was deleted successfully!`});
    });
};

exports.deleteAll = (req, res) => {
    Sale.removeAll((err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "SDome error occurred while removing all sales."
            });
        else res.send({message: `All sales were deleted successfully!`});
    });
};