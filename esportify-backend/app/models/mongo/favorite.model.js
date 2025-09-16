const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
    user_id: { type: Number, required: true, index: true },
    event_id: { type: Number, required: true, index: true },
    added_at: { type: Date, default: Date.now }
}, {
    collection: 'favorites'
});

favoriteSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

module.exports = model('Favorite', favoriteSchema);