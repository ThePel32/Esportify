const { query } = require('../config/db.js');

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { event_id } = req.body;
        if (!userId || !event_id) {
        return res.status(400).json({ message: 'Données manquantes' });
        }

        const rows = await query('SELECT title FROM events WHERE id = ? LIMIT 1', [event_id]);
        if (!rows.length) return res.status(404).json({ message: "Événement introuvable" });

        const gameKey = String(rows[0].title || '').toLowerCase();
        await query('INSERT IGNORE INTO favorites (user_id, game_key) VALUES (?, ?)', [userId, gameKey]);

        res.json({ message: `Favori ajouté pour le jeu : ${gameKey}` });
    } catch (err) {
        res.status(500).json({ message: 'Erreur ajout favori', err: err.message });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const userId = req.user?.id;
        const gameKey = req.params.gameKey?.toLowerCase();
        if (!userId || !gameKey) {
        return res.status(400).json({ message: 'Données manquantes' });
        }

        const result = await query('DELETE FROM favorites WHERE user_id = ? AND game_key = ?', [userId, gameKey]);
        if (!result.affectedRows) return res.status(404).json({ message: 'Favori non trouvé' });

        res.json({ message: `Favori supprimé pour le jeu : ${gameKey}` });
    } catch (err) {
        res.status(500).json({ message: 'Erreur suppression favori', err: err.message });
    }
};

exports.getFavoritesByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const results = await query('SELECT game_key FROM favorites WHERE user_id = ?', [userId]);
        res.json(results.map(r => r.game_key));
    } catch (err) {
        res.status(500).json({ message: 'Erreur récupération favoris', err: err.message });
    }
};
