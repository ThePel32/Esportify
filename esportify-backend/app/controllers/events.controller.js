const jwt = require('jsonwebtoken');
const Event = require('../models/events.model.js');
const sql = require('../config/db.js');
const EventBan = require('../models/eventBan.model.js');

// 🔁 Auto-start logic déplacée ici
const autoStartEventsIfNeeded = () => {
  const now = new Date();

  sql.query(`
    SELECT * FROM events
    WHERE state = 'validated'
      AND started = 0
      AND DATE_ADD(date_time, INTERVAL 15 MINUTE) <= ?
  `, [now], (err, rows) => {
    if (err) {
      console.error("Erreur auto-start dans findAll:", err);
      return;
    }

    if (!Array.isArray(rows)) {
      console.error("⚠ rows n'est pas un tableau :", rows);
      return;
    }

    console.log(`⏰ Auto-start : ${rows.length} événement(s) à démarrer`);

    const updatePromises = rows.map(event => {
      return new Promise((resolve, reject) => {
        sql.query(`
          UPDATE events
          SET started = 1, start_time_effective = ?
          WHERE id = ?
        `, [event.date_time, event.id], (err2) => {
          if (err2) reject(err2);
          else resolve();
        });
      });
    });

    Promise.all(updatePromises).catch(updateErr => {
      console.error("Erreur lors des mises à jour auto-start :", updateErr);
    });
  });
};

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
        console.error("Erreur SQL dans create event:", err); // 🔍 Ajouté ici
        return res.status(500).send({ 
            message: err.sqlMessage || err.message || "Erreur lors de la création de l'événement." 
        });
    }
    res.send(data);
});

    });
};

exports.findAll = (req, res) => {
    const title = req.query.title || "";
    const state = req.query.state || "";
  
    autoStartEventsIfNeeded();
  
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

exports.joinEvent = async (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    try {
        const event = await new Promise((resolve, reject) => {
            Event.findById(eventId, (err, evt) => {
                if (err || !evt) return reject("Événement introuvable.");
                resolve(evt);
            });
        });

        const isBanned = await EventBan.isUserBanned(eventId, userId);
        if (isBanned) {
            return res.status(403).send({ message: "Vous êtes banni de cet événement." });
        }

        const isGameBanned = await EventBan.isUserBannedFromGame(event.title, userId);
        if (isGameBanned) {
            return res.status(403).send({ message: `Vous êtes banni des événements du jeu ${event.title}.` });
        }

        const alreadyJoined = await new Promise((resolve, reject) => {
            sql.query(
                "SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?",
                [eventId, userId],
                (err, result) => {
                    if (err) return reject("Erreur interne.");
                    resolve(result.length > 0);
                }
            );
        });

        if (alreadyJoined) {
            return res.status(409).send({ message: "Déjà inscrit à l'événement." });
        }

        const participantCount = await new Promise((resolve, reject) => {
            sql.query(
                "SELECT COUNT(*) AS nb_participants FROM event_participants WHERE event_id = ?",
                [eventId],
                (err, result) => {
                    if (err) return reject("Erreur lors du comptage des participants.");
                    resolve(result[0].nb_participants);
                }
            );
        });

        if (participantCount >= event.max_players) {
            return res.status(400).send({ message: "L'événement est complet." });
        }

        await new Promise((resolve, reject) => {
            sql.query(
                "INSERT INTO event_participants (event_id, user_id, registered_at) VALUES (?, ?, NOW())",
                [eventId, userId],
                (err) => {
                    if (err) return reject("Erreur lors de l'inscription.");
                    resolve();
                }
            );
        });

        return res.send({ message: "Inscription réussie !" });

    } catch (err) {
        console.error("❌ Erreur joinEvent:", err);
        return res.status(500).send({ message: err.toString() });
    }
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
        "SELECT * FROM event_bans WHERE event_id = ? AND user_id = ?",
        [eventId, userId],
        (err, banResults) => {
            if (err) {
                console.error("Erreur lors de la vérification du bannissement :", err);
                return res.status(500).send({ message: "Erreur serveur" });
            }

            if (banResults.length > 0) {
                return res.status(403).send({ message: "Vous êtes banni de cet événement." });
            }

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
        }
    );
};


exports.kickParticipant = (req, res) => {
    const { id, userId } = req.params;
    sql.query(
        "DELETE FROM event_participants WHERE event_id = ? AND user_id = ?",
        [id, userId],
        (err, result) => {
            if (err) return res.status(500).send({ message: "Erreur lors du kick du participant." });

            if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Le participant n'existe pas ou n'est pas inscrit à cet événement." });
            }

            res.send({ message: "Participant kické avec succès !" });
        }
    );
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

exports.autoStartEvents = async (req, res) => {
    const now = new Date();

    try {
        const [rows] = await db.query(`
            SELECT * FROM events
            WHERE validated = 1
            AND started = 0
            AND DATE_ADD(date_time, INTERVAL 15 MINUTE) <= ?
        `, [now]);

        const updatePromises = rows.map(event => {
            return db.query(`
                UPDATE events
                SET started = 1, start_time_effective = ?
                WHERE id = ?
            `, [event.date_time, event.id]);
        });

        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Événements auto-démarrés.' });
    } catch (err) {
        console.error('Erreur auto-démarrage', err);
        res.status(500).json({ error: 'Erreur lors du démarrage automatique.' });
    }
};


exports.getHistory = (req, res) => {
    Event.getFinishedEvents((err, events) => {
        if (err) {
            return res.status(500).send({ message: "Erreur lors de la récupération des événements terminés." });
        }
        res.send(events);
    });
};

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