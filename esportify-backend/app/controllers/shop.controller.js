const Shop = require("../models/shop.model.js");

exports.create = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const shop = new Shop({
        name: req.body.name,
        adress: req.body.adress,
        zipCode: req.body.zipCode,
        city: req.body.city
    });

    Shop.create(shop, (err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the shop."
            });
        else res.send(data);
    });
};

exports.findAll = (req, res) => {
    const name = req.query.name;

    Shop.getAll(name, (err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving shop."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Shop.findById(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Not found shop with id ${req.params.id}.`
                });
            } else{
                return res.status(500).send({
                    message: "Error retrieving Shop with id " + req.params.id
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

    Shop.updateById(
        req.params.id,
        new Shop(req.body),
        (err,data) => {
            if(err){
                if(err.kind === "not_found"){
                    return res.status(404).send({
                        message: `Not found shop with id ${req.params.id}.`
                    });
                } else{
                    return res.status(500).send({
                        message: "Error updating shop with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

exports.delete = (req, res) => {
    Shop.remove(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Not found shop with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete shop with id " + req.params.id
                });
            }
        } else res.send({message: `Shop was deleted successfully!`});
    });
};

exports.deleteAll = (req, res) => {
    Shop.removeAll((err, data) => {
        if(err)
            return res.status(500).send({
                message: err.message || "Some error occurred while removing all shops."
            });
        else res.send({message: `All shops were deleted successfully!`});
    });
};