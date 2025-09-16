// app/service/chat.service.js
const sql = require("../config/db.js");
const ChatModel = require("../models/mongo/chat.model");

const Chat = {
    /**
     * @param {{ event_id: Number, user_id: Number, username: String, content: String }} messageData
     * @param {(err: any, insertId: any) => void} callback
     */
    createMessage: async (messageData, callback) => {
        const { event_id, user_id, username, content } = messageData;

        sql.query(
        `INSERT INTO chat_messages (event_id, user_id, username, content, created_at)
        VALUES (?, ?, ?, ?, NOW())`,
        [event_id, user_id, username, content],
        (sqlErr, sqlRes) => {
            if (sqlErr) {
            console.error("Erreur SQL lors de l'insertion du message :", sqlErr);
            }
        }
        );

        try {
        const doc = await ChatModel.create({ event_id, user_id, username, content });
        callback(null, doc._id);
        } catch (mongoErr) {
        console.error("Erreur MongoDB lors de l'insertion du message :", mongoErr);
        callback(mongoErr, null);
        }
    },

    /**
     * @param {Number} eventId
     * @param {(err: any, messages: any[]) => void} callback
     */
    getMessagesForEvent: (eventId, callback) => {
        sql.query(
        `SELECT username, content, created_at
        FROM chat_messages
        WHERE event_id = ?
        ORDER BY created_at ASC`,
        [eventId],
        async (sqlErr, sqlRows) => {
            if (sqlErr) {
            console.error("Erreur SQL lors de la récupération des messages :", sqlErr);
            return callback(sqlErr, null);
            }

            try {
            const mongoDocs = await ChatModel
                .find({ event_id: eventId })
                .sort({ send_at: 1 })
                .select("username content send_at")
                .lean();

            const formattedSql = sqlRows.map(r => ({
                username:    r.username,
                content:     r.content,
                created_at:  r.created_at
            }));
            const formattedMongo = mongoDocs.map(d => ({
                username:    d.username,
                content:     d.content,
                created_at:  d.send_at
            }));

            const merged = [...formattedSql, ...formattedMongo].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );

            callback(null, merged);
            } catch (mongoErr) {
            console.error("Erreur MongoDB lors de la récupération des messages :", mongoErr);
            callback(mongoErr, null);
            }
        }
        );
    }
};

module.exports = Chat;
