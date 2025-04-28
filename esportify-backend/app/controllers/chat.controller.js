const ChatService = require('../service/chat.service');

exports.saveMessage = async (messageData) => {
    try {
        const messageId = await ChatService.saveMessage(messageData);
        return messageId;
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du message:', error);
        throw error;
    }
};
