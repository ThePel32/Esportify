const db = require('../config/db.js');

exports.addFavorite = (req, res) => {
    const userId = req.user?.id;
    const { event_id } = req.body;

    if (!userId || !event_id) {
        return res.status(400).json({ message: "Données manquantes" });
    }

    const sqlGetGame = `SELECT title FROM events WHERE id = ?`;
    db.query(sqlGetGame, [event_id], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "Événement introuvable" });
        }

        const gameKey = result[0].title.toLowerCase();

        const insertSql = `
            INSERT IGNORE INTO favorites (user_id, game_key)
            VALUES (?, ?)
        `;

        db.query(insertSql, [userId, gameKey], (err2) => {
            if (err2) {
                return res.status(500).json({ message: "Erreur ajout favori", err2 });
            }

            res.status(200).json({ message: `Favori ajouté pour le jeu : ${gameKey}` });
        });
    });
};

exports.removeFavorite = (req, res) => {
    const userId = req.user?.id;
    const gameKey = req.params.gameKey?.toLowerCase();

    if (!userId || !gameKey) {
        return res.status(400).json({ message: "Données manquantes" });
    }

    const deleteSql = `DELETE FROM favorites WHERE user_id = ? AND game_key = ?`;
    db.query(deleteSql, [userId, gameKey], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur suppression favori", err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Favori non trouvé" });
        }

        res.status(200).json({ message: `Favori supprimé pour le jeu : ${gameKey}` });
    });
};

exports.getFavoritesByUser = (req, res) => {
    const userId = req.user.id;

    const sql = `SELECT game_key FROM favorites WHERE user_id = ?`;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur récupération favoris", err });

        const games = results.map(row => row.game_key);
        res.status(200).json(games);
    });
};