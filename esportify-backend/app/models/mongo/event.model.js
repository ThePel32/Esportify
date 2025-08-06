const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date_time: { type: Date, required: true, index: true },
    duration: { type: Number, default: 1 },
    max_players: { type: Number, default: 0 },
    organizer_id: { type: Number, required: true, index: true },
    state: { type: String, enum: ['pending','validated','cancelled'], default: 'pending' },
    started: { type: Boolean, default: false },
    images: [{ type: String }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    collection: 'events'
});

eventSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = model('Event', eventSchema);