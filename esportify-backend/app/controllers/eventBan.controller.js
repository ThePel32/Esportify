const EventBan = require ('../models/eventBan.model');

exports.banUserFromEvent = async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        await EventBan.banUser(eventId, userId);
        res.status(200).json({ message: "Utilisateur banni de l'événement." });
    } catch (err) {
        console.error("Erruer lors du bannissement :", err);
        res.status(500).json({ error: "Erreur serveur lors du bannissement." });
    }
};

exports.unbanUser = async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        await EventBan.unbanUser(eventId, userId);
        res.status(200).json({ message: "Utilisateur débanni." });
    } catch (err) {
        console.error("Erreur unban :", err);
        res.status(500).json({ error: "Erreur serveur lors du unban." });
    }
};


exports.checkIfUserBanned = async (req, res) => {
    const { eventId, userId } = req.params;
    try {
        const isBanned = await EventBan.isUserBanned(eventId, userId);
        res.status(200).json({ banned: isBanned });
    } catch (err) {
        console.error("Erreur chack ban :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.getBannedUsers = async (req, res) => {
    const { eventId } = req.params;
    try {
        const bannedUsers = await EventBan.getBannedUsers(eventId);
        res.status(200).json(bannedUsers);
    } catch (err) {
        console.error("Erreur get banned users :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
};