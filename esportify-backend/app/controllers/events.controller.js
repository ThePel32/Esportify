const Event = require("../models/events.model.js");

exports.create = (req, res) => {
    if(!req.body){
        return res.status(400).send({
        message: "Content can not be empty !"
        });
    }

    const event = new Event({
        title: req.body.title,
        description: req.body.description,
        date_time: req.body.date_time,
        max_players: req.body.max_players,
        organizer_id: req.body.organizer_id,
        state: req.body.state,
        images: req.body.images,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    });

    Event.create(event, (err, data) => {
        if(err){
            return res.status(500).send({
                message: err.message || "Some error occured while creating the event."
            });
        }
        else res.send(data);
    });
};

exports.findAll = (req, data) => {
    const title = req.query.title;

    Event.getAll(title, (err, res) => {
        if(err){
            return res.status(500).send({
                message: err.message || "Some error occured while retrieving event."
            });
        }
        else res.send(data);
    });
};

exports.findOne = async (req, res) => {
    try {
        const data = await EventModel.findById(req.params.id);
        if (!data) {
            return res.status(404).send({ message: `Event not found with id ${req.params.id}.` });
        }
        res.send(data);
    } catch (err) {
        return res.status(500).send({ message: `Error retrieving event with id ${req.params.id}.` });
    }
};


exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

        Event.updateById(
            req.params.id,
            new Event(req.body),
            (err, data) => {
                if(err){
                    if(err.kind === "not_found"){
                        return res.status(404).send({
                            message: `Not found event with id ${req.params.id}.`
                        });
                    } else {
                        return res.status(500).send({
                            message: "Error updating event with id " + req.params.id
                        });
                    }
                } else res.send(data);
            }
        );
};

exports.delete = (req, res) => {
    Event.remove(req.params.id, (err) => {
        if(err){
            if(err.kind === "not_found"){
                return res.status(404).send({
                    message: `Not found event with id ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete event with id " + req.params.id
                });
            }
        } else res.send({
            message: `Event was deleted successfully !`
        });
    });
};

exports.deleteAll = (req, res) => {
    EventModel.removeAll((err) => {
        if(err){
            return res.status(500).send({
                message: err.message || "Some error occurred while removing all events."
            });
        } else res.send({
            message: `All events were deleted successfully !`
        });
    });
};