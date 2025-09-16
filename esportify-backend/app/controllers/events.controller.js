const Event = require('../models/events.model');
const EventBan = require('../models/eventBan.model');
const db = require('../config/db');

async function autoStartEventsIfNeeded() {
    const now = new Date();
    const [rows] = await db.query(
        `
        SELECT id, date_time
        FROM events
        WHERE state = 'validated'
        AND started = 0
        AND DATE_ADD(date_time, INTERVAL 15 MINUTE) <= ?
        `,
        [now]
    );
    
    if (!rows?.length) return;
    
    const updates = rows.map(e =>
        db.query(
            `
            UPDATE events
            SET started = 1, start_time_effective = ?
            WHERE id = ?
            `,
            [e.date_time, e.id]
        )
    );
    await Promise.all(updates);
}

exports.create = async (req, res) => {
    try {
        if (!req.body) return res.status(400).send({ message: 'Le contenu ne peut pas être vide !' });
        if (!req.user) return res.status(401).send({ message: 'Utilisateur non authentifié.' });
        
        const event = {
            title: req.body.title,
            description: req.body.description,
            date_time: req.body.date_time,
            max_players: req.body.max_players,
            organizer_id: req.user.id,
            state: 'pending',
            images: req.body.images,
            duration: req.body.duration || 1,
            created_at: new Date(),
            updated_at: new Date()
        };
        
        const created = await Event.create(event);
        res.status(201).send(created);
    } catch (err) {
        res.status(500).send({ message: err.sqlMessage || err.message || "Erreur lors de la création de l'événement." });
    }
};

exports.findAll = async (req, res) => {
    try {
        const title = req.query.title || '';
        const state = req.query.state || '';
        
        await autoStartEventsIfNeeded();
        
        const events = await Event.getAll(title, state);
        res.send(events);
    } catch (err) {
        res.status(500).send({ message: err.message || 'Erreur lors de la récupération des événements.' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send({ message: `Événement non trouvé avec l'ID ${eventId}.` });
        
        const [participants] = await db.query(
            `
            SELECT users.id, users.username, ep.has_joined
            FROM event_participants ep
            JOIN users ON ep.user_id = users.id
            WHERE ep.event_id = ?
            `,
            [eventId]
        );
        
        event.participants = participants || [];
        res.send(event);
    } catch (err) {
        res.status(500).send({ message: "Erreur lors de la récupération de l'événement." });
    }
};

exports.validate = async (req, res) => {
    try {
        const eventId = req.params.id;
        const [result] = await db.query(
            `UPDATE events SET state = ?, updated_at = ? WHERE id = ?`,
            ['validated', new Date(), eventId]
        );
        if (!result.affectedRows) return res.status(404).send({ message: 'Événement non trouvé.' });
        res.send({ message: 'Événement validé avec succès.' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors de la validation.' });
    }
};

exports.joinEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        
        const evt = await Event.findById(eventId);
        if (!evt) return res.status(404).send({ message: 'Événement introuvable.' });
        
        const isBanned = await EventBan.isUserBanned(eventId, userId);
        if (isBanned) return res.status(403).send({ message: 'Vous êtes banni de cet événement.' });
        
        const isGameBanned = await EventBan.isUserBannedFromGame(evt.title, userId);
        if (isGameBanned) {
            return res.status(403).send({ message: `Vous êtes banni des événements du jeu ${evt.title}.` });
        }
        
        const [already] = await db.query(
            `SELECT 1 FROM event_participants WHERE event_id = ? AND user_id = ? LIMIT 1`,
            [eventId, userId]
        );
        if (already.length) return res.status(409).send({ message: "Déjà inscrit à l'événement." });
        
        const [[countRow]] = await db.query(
            `SELECT COUNT(*) AS nb FROM event_participants WHERE event_id = ?`,
            [eventId]
        );
        if (countRow.nb >= evt.max_players) return res.status(400).send({ message: "L'événement est complet." });
        
        await db.query(
            `INSERT INTO event_participants (event_id, user_id, registered_at) VALUES (?, ?, NOW())`,
            [eventId, userId]
        );
        
        res.send({ message: 'Inscription réussie !' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur interne.' });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body) return res.status(400).send({ message: 'Le contenu ne peut pas être vide !' });
        
        const current = await Event.findById(req.params.id);
        if (!current) return res.status(404).send({ message: `Événement non trouvé avec l'ID ${req.params.id}.` });
        if (current.started) return res.status(400).send({ message: 'Impossible de modifier un événement déjà démarré.' });
        
        const updatedEvent = {
            ...req.body,
            state: 'pending',
            updated_at: new Date(),
            started: current.started || 0,
            organizer_id: current.organizer_id
        };
        
        const data = await Event.updateById(req.params.id, updatedEvent);
        res.send({ message: 'Événement mis à jour et repassé en attente de validation.', data });
    } catch (err) {
        res.status(500).send({ message: "Erreur lors de la mise à jour de l'événement." });
    }
};

exports.leaveEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.query(`DELETE FROM event_participants WHERE event_id = ? AND user_id = ?`, [req.params.id, userId]);
        res.send({ message: 'Désinscription réussie !' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors de la désinscription.' });
    }
};

exports.confirmJoin = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        
        const [bans] = await db.query(
            `SELECT 1 FROM event_bans WHERE event_id = ? AND user_id = ? LIMIT 1`,
            [eventId, userId]
        );
        if (bans.length) return res.status(403).send({ message: 'Vous êtes banni de cet événement.' });
        
        const [result] = await db.query(
            `UPDATE event_participants SET has_joined = TRUE WHERE event_id = ? AND user_id = ?`,
            [eventId, userId]
        );
        if (!result.affectedRows) {
            return res.status(404).send({ message: 'Aucune participation trouvée pour mise à jour.' });
        }
        res.send({ message: 'Présence confirmée !' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur serveur' });
    }
};

exports.kickParticipant = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const [result] = await db.query(
            `DELETE FROM event_participants WHERE event_id = ? AND user_id = ?`,
            [id, userId]
        );
        if (!result.affectedRows) {
            return res.status(404).send({ message: "Le participant n'existe pas ou n'est pas inscrit à cet événement." });
        }
        res.send({ message: 'Participant kické avec succès !' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors du kick du participant.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const current = await Event.findById(req.params.id);
        if (!current) return res.status(404).send({ message: `Événement non trouvé avec l'ID ${req.params.id}.` });
        if (current.started) return res.status(400).send({ message: 'Impossible de supprimer un événement déjà démarré.' });
        
        await Event.remove(req.params.id);
        res.send({ message: 'Événement supprimé avec succès !' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors de la suppression de l’événement.' });
    }
};

exports.deleteAll = async (_req, res) => {
    try {
        await Event.removeAll();
        res.send({ message: 'Tous les événements ont été supprimés avec succès !' });
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors de la suppression des événements.' });
    }
};

exports.startEvent = async (req, res) => {
    try {
        const data = await Event.startById(req.params.id);
        if (!data) return res.status(404).send({ message: `Événement non trouvé avec l'ID ${req.params.id}.` });
        res.send({ message: 'Événement démarré avec succès !', data });
    } catch (err) {
        res.status(500).send({ message: "Erreur lors du démarrage de l'événement." });
    }
};

exports.autoStartEvents = async (_req, res) => {
    try {
        await autoStartEventsIfNeeded();
        res.status(200).json({ message: 'Événements auto-démarrés.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du démarrage automatique.' });
    }
};

exports.getHistory = async (_req, res) => {
    try {
        const events = await Event.getFinishedEvents();
        res.send(events);
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors de la récupération des événements terminés.' });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const events = await Event.getUserFinishedEvents(userId);
        res.send(events);
    } catch (err) {
        res.status(500).send({ message: "Erreur lors de la récupération des événements terminés de l'utilisateur." });
    }
};

exports.getAllEndedEvents = async (_req, res) => {
    try {
        const nowISO = new Date().toISOString();
        const [rows] = await db.query(
            `
            SELECT e.*, u.username AS organizer_name
            FROM events e
            JOIN users u ON e.organizer_id = u.id
            WHERE e.state = 'validated'
                AND e.started = 1
                AND TIMESTAMPADD(HOUR, e.duration, e.date_time) < ?
            ORDER BY e.date_time DESC
            `,
            [nowISO]
        );
        res.send(rows);
    } catch (err) {
        res.status(500).send({ message: 'Erreur lors de la récupération des événements terminés.' });
    }
};
