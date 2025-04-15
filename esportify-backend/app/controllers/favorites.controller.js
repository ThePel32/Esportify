const db = require('../models/db');

exports.addFavorite = (req, res) => {
    const { user_id, event_id } = req.body;
    db.query(
        'INSERT IGNORE INTO favorites (user_id, event_id) VALUES (?, ?)',
        [user_id, event_id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Erreur ajout favori', err });
            res.status(200).json({ message: 'Ajouté aux favoris' });
        }
    );
};

exports.removeFavorite = (req, res) => {
    const { user_id, event_id } = req.body;
    db.query(
        'DELETE FROM favorites WHERE user_id = ? AND event_id = ?',
        [user_id, event_id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Erreur suppression favori', err });
            res.status(200).json({ message: 'Retiré des favoris' });
        }
    );
};

exports.getFavoritesByUser = (req, res) => {
    const userId = req.params.userId;
    db.query(
        'SELECT event_id FROM favorites WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Erreur récupération favoris', err });
            res.status(200).json(results.map((row) => row.event_id));
        }
    );
};
