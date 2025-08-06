const { Schema, model } = require('mongoose');

const eventBanSchema = new Schema({
    event_id:    { type: Number, required: true, index: true },
    user_id:     { type: Number, required: true, index: true },
    banned_at:   { type: Date, default: Date.now }
}, {
    collection: 'event_bans'
});

eventBanSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = model('EventBan', eventBanSchema);
