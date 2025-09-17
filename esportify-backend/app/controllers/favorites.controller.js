const db = require('../config/db.js');

function toGameKey(title = '') {
    const s = String(title).toLowerCase().replace(/[\s\-_.]/g, '');
    if (s.includes('counter') || s.includes('cs2')) return 'cs2';
    if (s.includes('fc24') || s.includes('eafc') || s.includes('fifa') || s === 'fc24') return 'fc24';
    if (s.includes('pubg') || s.includes('battlegrounds')) return 'pubg';
    if (s.includes('balatro')) return 'balatro';
    return s;
}

exports.addFavorite = (req, res) => {
    const userId = Number(req.user?.id);
    const { event_id } = req.body;
    if (!userId || !event_id) return res.status(400).json({ message: 'Données manquantes' });

    const sqlGetTitle = 'SELECT title FROM events WHERE id = ? LIMIT 1';
    db.query(sqlGetTitle, [event_id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Erreur SQL', err });
        if (!rows?.length) return res.status(404).json({ message: 'Événement introuvable' });

        const gameKey = toGameKey(rows[0].title);
        const insertSql = 'INSERT IGNORE INTO favorites (user_id, game_key) VALUES (?, ?)';
        db.query(insertSql, [userId, gameKey], (err2) => {
        if (err2) return res.status(500).json({ message: 'Erreur ajout favori', err: err2 });
        res.status(200).json({ message: `Favori ajouté: ${gameKey}` });
        });
    });
};

exports.removeFavorite = (req, res) => {
    const userId = Number(req.user?.id);
    const gameKey = toGameKey(req.params.gameKey || '');
    if (!userId || !gameKey) return res.status(400).json({ message: 'Données manquantes' });

    const sql = 'DELETE FROM favorites WHERE user_id = ? AND game_key = ?';
    db.query(sql, [userId, gameKey], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur suppression favori', err });
        if (!result.affectedRows) return res.status(404).json({ message: 'Favori non trouvé' });
        res.status(200).json({ message: `Favori supprimé: ${gameKey}` });
    });
};

exports.getFavoritesByUser = (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(401).json({ message: 'Token requis' });

    const sql = 'SELECT game_key FROM favorites WHERE user_id = ? ORDER BY game_key ASC';
    db.query(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Erreur récupération favoris', err });
        const keys = [...new Set((rows || []).map(r => toGameKey(r.game_key)))];
        res.status(200).json(keys);
    });
};
