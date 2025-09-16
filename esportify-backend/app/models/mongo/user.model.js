const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true, index: true },
    email:    { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ['player','organizer','admin'], default: 'player' },
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date }
    }, {
    collection: 'users',
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.set('toJSON', {
    transform: (_, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

module.exports = model('User', userSchema);
