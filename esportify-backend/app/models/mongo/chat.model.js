const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    event_id: { type: Number, required: true, index: true },
    user_id: { type: Number, required: true, index: true },
    username: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    send_at: { type: Date, default: Date.now, index: true }
}, {
    collection: 'chats'
});

module.exports = model('Chat', chatSchema);