const jwt = require('jsonwebtoken');
const Event = require("../models/events.model.js");
const sql = require("../config/db.js");

exports.create = (req, res) => {
    if (!req.body) {
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
                return res.status(500).send({ message: err.message || "Erreur lors de la création de l'événement." });
            }
            res.send(data);
        });
    });
};

exports.findAll = (req, res) => {
    const title = req.query.title || "";
    const state = req.query.state || "";


    Event.getAll(title, state, (err, events) => {
        if (err) {
            return res.status(500).send({ message: err.message || "Erreur lors de la récupération des événements." });
        }

        res.send(events);

    });
};


exports.findOne = (req, res) => {
    const eventId = req.params.id;

    Event.findById(eventId, (err, event) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({ message: `Événement non trouvé avec l'ID ${eventId}.` });
            }
            return res.status(500).send({ message: `Erreur lors de la récupération de l'événement avec l'ID ${eventId}.` });
        }

        // 🔽 Nouvelle requête pour récupérer les participants
        sql.query(
            `SELECT users.id, users.username, ep.has_joined
            FROM event_participants ep
            JOIN users ON ep.user_id = users.id
            WHERE ep.event_id = ?`,
            [eventId],
            (err2, participants) => {
                if (err2) {
                    console.error("Erreur lors du fetch des participants :", err2);
                    return res.status(500).send({ message: "Erreur lors de la récupération des participants." });
                }

                // 🔗 Ajout des participants dans l'objet event
                event.participants = participants;
                res.send(event);
            }
        );
    });
};


exports.validate = (req, res) => {
    const eventId = req.params.id;


    sql.query(
        "UPDATE events SET state = ?, updated_at = ? WHERE id = ?",
        ["validated", new Date(), eventId],
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Erreur lors de la validation." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).send({ message: "Événement non trouvé." });
            }

            res.send({ message: "Événement validé avec succès." });
        }
    );
};

exports.joinEvent = (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    Event.findById(eventId, (err, event) => {
        if (err || !event) {
            return res.status(404).send({ message: "Événement introuvable." });
        }

        sql.query(
            "SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?",
            [eventId, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).send({ message: "Erreur interne." });
                }

                if (result.length > 0) {
                    return res.status(409).send({ message: "Déjà inscrit à l'événement." });
                }

                sql.query(
                    "SELECT COUNT(*) AS nb_participants FROM event_participants WHERE event_id = ?",
                    [eventId],
                    (err, countRes) => {
                        if (err) {
                            return res.status(500).send({ message: "Erreur lors du comptage des participants." });
                        }

                        const nbParticipants = countRes[0].nb_participants;

                        if (nbParticipants >= event.max_players) {
                            return res.status(400).send({ message: "L'événement est complet." });
                        }

                        sql.query(
                            "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)",
                            [eventId, userId],
                            (err) => {
                                if (err) {
                                    return res.status(500).send({ message: "Erreur lors de l'inscription à l'événement." });
                                }
                                res.send({ message: "Inscription réussie !" });
                            }
                        );
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

exports.confirmJoin = (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    sql.query(
        'UPDATE event_participants SET has_joined = true WHERE event_id = ? AND user_id = ?',
        [eventId, userId],
        (err, result) => {
            if (err) {
                console.error("Erreur DB :", err);
                return res.status(500).send({ message: "Erreur serveur" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: "Aucune participation trouvée pour mise à jour." });
            }
            res.send({ message: "Présence confirmée !" });
        }
    );
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

exports.startEvent = (req, res) => {
    const eventId = req.params.id;
    Event.startById(eventId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({ message: `Événement non trouvé avec l'ID ${eventId}.` });
        }
        return res.status(500).send({ message: "Erreur lors du démarrage de l'événement." });
      }
      res.send({ message: "Événement démarré avec succès !", data });
    });
  };

// Tous les événements terminés
exports.getHistory = (req, res) => {
    Event.getFinishedEvents((err, events) => {
      if (err) {
        return res.status(500).send({ message: "Erreur lors de la récupération des événements terminés." });
      }
      res.send(events);
    });
  };
  
  // Événements terminés pour un utilisateur
  exports.getUserHistory = (req, res) => {
    const userId = req.params.userId;
    Event.getUserFinishedEvents(userId, (err, events) => {
      if (err) {
        return res.status(500).send({ message: "Erreur lors de la récupération des événements terminés de l'utilisateur." });
      }
      res.send(events);
    });
  };

  exports.getAllEndedEvents = (req, res) => {
    const now = new Date();
    const nowISO = now.toISOString();

    sql.query(`
        SELECT e.*, u.username AS organizer_name
        FROM events e
        JOIN users u ON e.organizer_id = u.id
        WHERE e.state = 'validated'
        AND e.started = 1
        AND TIMESTAMPADD(HOUR, e.duration, e.date_time) < ?
        ORDER BY e.date_time DESC
    `, [nowISO], (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send({ message: "Erreur lors de la récupération des événements terminés." });
        }

        res.send(results);
    });
};

  

module.exports = exports;