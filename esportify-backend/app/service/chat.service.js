const sql = require("../config/db.js");

const Chat = {
    createMessage: (messageData, callback) => {
        const query = `
        INSERT INTO chat_messages (event_id, user_id, username, content, created_at)
        VALUES (?, ?, ?, ?, NOW())
        `;
        const { event_id, user_id, username, content } = messageData;

        sql.query(query, [event_id, user_id, username, content], (err, res) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du message dans la BDD:', err);
            callback(err, null);
            return;
        }
        callback(null, res.insertId);
        });
    },

    getMessagesForEvent: (eventId, callback) => {
        const query = `
        SELECT username, content, created_at
        FROM chat_messages
        WHERE event_id = ?
        ORDER BY created_at ASC
        `;

        sql.query(query, [eventId], (err, res) => {
        if (err) {
            console.error('Erreur lors de la récupération des messages pour l\'événement:', err);
            callback(err, null);
            return;
        }
        callback(null, res);
        });
    }
};

module.exports = Chat;
