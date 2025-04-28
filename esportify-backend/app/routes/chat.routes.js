const express = require('express');
const router = express.Router();
const Chat = require('../service/chat.service');

router.post('/send-message', (req, res) => {
    const { eventId, userId, username, content } = req.body;

    if (!eventId || !userId || !username || !content) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const messageData = { event_id: eventId, user_id: userId, username, content };

    Chat.createMessage(messageData, (err, insertId) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'envoi du message.' });
        }
        res.status(201).json({ message: 'Message envoyé avec succès.', id: insertId });
    });
});

router.get('/messages/:eventId', (req, res) => {
    const eventId = req.params.eventId;

    Chat.getMessagesForEvent(eventId, (err, messages) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
        }
        res.status(200).json(messages);
    });
});

module.exports = router;
