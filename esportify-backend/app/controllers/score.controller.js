const db = require('../config/db');

exports.addScore = (req, res) => {
    const { user_id, event_id, score, result, position, metadata } = req.body;

    const query = `
        INSERT INTO scores (user_id, event_id, score, result, position, metadata, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const values = [
        user_id,
        event_id,
        score,
        result,
        position || null, // si non défini
        JSON.stringify(metadata || {})
    ];

    console.log("🧾 INSERT SCORE", values); // 👈 pour debug

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Erreur insertion score :', err);
            return res.status(500).json({ error: 'Erreur insertion score' });
        }
        res.status(201).json({ message: 'Score enregistré' });
    });
};

exports.getScoresForEvent = (req, res) => {
    const eventId = req.params.eventId;

    const query = `
        SELECT s.*, u.username
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.event_id = ?
        ORDER BY s.score DESC
    `;

    db.query(query, [eventId], (err, rows) => {
        if (err) {
            console.error('❌ Erreur dans getScoresForEvent :', err);
            return res.status(500).json({ error: 'Erreur récupération scores' });
        }
        res.status(200).json(rows);
    });
};

exports.getTopScoresForEvent = (req, res) => {
    const eventId = req.params.eventId;

    const query = `
        SELECT s.*, u.username
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.event_id = ?
        ORDER BY s.score DESC
        LIMIT 10
    `;

    db.query(query, [eventId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération top scores' });
        res.status(200).json(rows);
    });
};

exports.getScoreForUser = (req, res) => {
    const { eventId, userId } = req.params;

    const query = `SELECT * FROM scores WHERE event_id = ? AND user_id = ?`;

    db.query(query, [eventId, userId], (err, rows) => {
        if (err) {
            console.error('❌ Erreur dans getScoreForUser :', err);
            return res.status(500).json({ error: 'Erreur récupération score utilisateur' });
        }
        res.status(200).json(rows[0] || null);
    });
};
