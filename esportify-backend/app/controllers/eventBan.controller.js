const EventBan = require('../models/eventBan.model');
const db = require('../config/db');

exports.banUserFromEvent = async (req, res) => {
  const { eventId, userId } = req.params;
  try {
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM event_participants WHERE event_id = ? AND user_id = ?",
        [eventId, userId],
        (err) => (err ? reject(err) : resolve())
      );
    });

    await EventBan.banUser(eventId, userId);

    res.status(200).json({ message: "Utilisateur banni et retiré de l'événement." });
  } catch (err) {
    console.error("Erreur lors du bannissement :", err);
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
    console.error("Erreur check ban :", err);
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

exports.getAllBans = (req, res) => {
  const query = `
    SELECT eb.*, u.username, e.title AS event_title
    FROM event_bans eb
    JOIN users u ON eb.user_id = u.id
    JOIN events e ON eb.event_id = e.id
    ORDER BY eb.banned_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur récupération des bannis :", err);
      return res.status(500).json({ message: "Erreur serveur", err });
    }

    res.status(200).json(results);
  });
};

exports.checkIfUserBannedFromGame = async (req, res) => {
    const { gameKey, userId } = req.params;
    try {
        const banned = await EventBan.isUserBannedFromGame(gameKey, userId);
        res.status(200).json({ banned });
    } catch (err) {
        console.error("Erreur check ban par jeu :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
};