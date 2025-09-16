const { Schema, model } = require('mongoose');

const scoreSchema = new Schema({
    event_id: { type: Number, required: true, index: true },
    user_id: { type: Number, required: true, index: true },
    value: { type: Number, required: true },
    recorded_at: { type: Date, default: Date.now, index: true }
}, {
    collection: 'scores'
});

module.exports = model('Score', scoreSchema);