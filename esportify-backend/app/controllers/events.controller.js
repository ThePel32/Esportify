const jwt = require('jsonwebtoken');
const Event = require("../models/events.model.js");
const sql = require("../models/db.js");

exports.create = (req, res) => {
    if (!req.body) {
        console.error("❌ Le corps de la requête est vide.");
        return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
    }

    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
    if (!token) {
        return res.status(401).send({ message: "Token manquant, veuillez vous authentifier." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Token invalide ou expiré." });
        }

        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            date_time: req.body.date_time,
            max_players: req.body.max_players,
            organizer_id: decoded.id,
            state: "pending",
            images: req.body.images,
            duration: req.body.duration || 1,
            created_at: new Date(),
            updated_at: new Date(),
        });

        Event.create(event, (err, data) => {
            if (err) {
                console.error("❌ Erreur lors de la création de l'événement :", err);
                return res.status(500).send({ message: err.message || "Erreur lors de la création de l'événement." });
            }
            console.log("✅ Événement créé avec succès :", data);
            res.send(data);
        });
    });
};

exports.findAll = (req, res) => {
    const title = req.query.title || "";
    const state = req.query.state || "";

    console.log("📢 Paramètres reçus - title :", title, ", state :", state);

    Event.getAll(title, state, (err, events) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des événements :", err);
            return res.status(500).send({ message: err.message || "Erreur lors de la récupération des événements." });
        }

        console.log("✅ Événements trouvés avant envoi :", JSON.stringify(events, null, 2));
        
        if (!Array.isArray(events)) {
            console.error("❌ Problème : 'events' n'est pas un tableau !");
        } else if (events.length === 0) {
            console.warn("⚠️ Aucun événement trouvé, alors qu'on en attendait !");
        }

        res.send(events);
    });
};


exports.findOne = (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({ message: `Événement non trouvé avec l'ID ${req.params.id}.` });
            }
            return res.status(500).send({ message: `Erreur lors de la récupération de l'événement avec l'ID ${req.params.id}.` });
        }
        res.send(event);
    });
};

exports.validate = (req, res) => {
    const eventId = req.params.id;

    console.log(`📢 Validation de l'événement ID : ${eventId}`);

    sql.query(
        "UPDATE events SET state = ?, updated_at = ? WHERE id = ?",
        ["validated", new Date(), eventId],
        (err, result) => {
            if (err) {
                console.error("❌ Erreur lors de la validation de l'événement :", err);
                return res.status(500).send({ message: "Erreur lors de la validation." });
            }

            if (result.affectedRows === 0) {
                console.warn("⚠️ Aucun événement mis à jour, ID non trouvé :", eventId);
                return res.status(404).send({ message: "Événement non trouvé." });
            }

            console.log("✅ Événement validé avec succès !");
            res.send({ message: "Événement validé avec succès." });
        }
    );
};

exports.joinEvent = (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    console.log(`📢 Tentative d'inscription de l'utilisateur ID: ${userId} à l'événement ID: ${eventId}`);

    Event.findById(eventId, (err, event) => {
        if (err || !event) {
            console.error("❌ Événement introuvable ou erreur :", err);
            return res.status(404).send({ message: "Événement introuvable." });
        }

        sql.query(
            "SELECT COUNT(*) AS nb_participants FROM event_participants WHERE event_id = ?",
            [eventId],
            (err, result) => {
                if (err) {
                    console.error("❌ Erreur lors du comptage des participants :", err);
                    return res.status(500).send({ message: "Erreur lors du comptage des participants." });
                }

                const nbParticipants = result[0].nb_participants;
                console.log(`👥 Nombre de participants actuels : ${nbParticipants} / ${event.max_players}`);

                if (nbParticipants >= event.max_players) {
                    console.warn("⚠️ L'événement est déjà complet !");
                    return res.status(400).send({ message: "L'événement est complet." });
                }

                sql.query(
                    "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)",
                    [eventId, userId],
                    (err) => {
                        if (err) {
                            console.error("❌ Erreur lors de l'inscription :", err);
                            return res.status(500).send({ message: "Erreur lors de l'inscription à l'événement." });
                        }
                        console.log("✅ Inscription réussie !");
                        res.send({ message: "Inscription réussie !" });
                    }
                );
            }
        );
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Le contenu ne peut pas être vide !" });
    }

    Event.updateById(req.params.id, new Event(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({ message: `Événement non trouvé avec l'ID ${req.params.id}.` });
            }
            return res.status(500).send({ message: "Erreur lors de la mise à jour de l'événement." });
        }
        res.send(data);
    });
};


exports.leaveEvent = (req, res) => {
    const userId = req.user.id;
    sql.query("DELETE FROM event_participants WHERE event_id = ? AND user_id = ?", [req.params.id, userId], (err) => {
        if (err) return res.status(500).send({ message: "Erreur lors de la désinscription." });
        res.send({ message: "Désinscription réussie !" });
    });
};

exports.removeParticipant = (req, res) => {
    const { id, userId } = req.params;

    sql.query("DELETE FROM event_participants WHERE event_id = ? AND user_id = ?", [id, userId], (err, result) => {
        if (err) return res.status(500).send({ message: "Erreur lors de la suppression du participant." });

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Le participant n'existe pas ou n'est pas inscrit à cet événement." });
        }

        res.send({ message: "Participant retiré avec succès !" });
    });
};

exports.delete = (req, res) => {
    Event.remove(req.params.id, (err) => {
        if (err) return res.status(500).send({ message: "Erreur lors de la suppression de l'événement." });
        res.send({ message: "Événement supprimé avec succès !" });
    });
};

exports.deleteAll = (req, res) => {
    Event.removeAll((err) => {
        if (err) return res.status(500).send({ message: "Erreur lors de la suppression des événements." });
        res.send({ message: "Tous les événements ont été supprimés avec succès !" });
    });
};


module.exports = exports;