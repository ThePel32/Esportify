const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    sent_at: { type: Date, default: Date.now, index: true }
}, {
    collection: 'contacts'
});

module.exports = model('Contact', contactSchema);