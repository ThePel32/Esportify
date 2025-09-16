const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/mongo/user.model');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('[auth] JWT_SECRET absent !');
}

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        const u = new User({ username, email, password, role });
        await u.save();
        res.status(201).json(u.toJSON());
    } catch (err) {
        if (err.code === 11000) {
        return res.status(409).json({ message: 'Email ou username déjà utilisé' });
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const u = await User.findOne({ email }).select('+password');
        if (!u) return res.status(401).json({ message: 'Identifiants invalides' });

        const ok = await bcrypt.compare(password, u.password);
        if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

        const token = jwt.sign(
        { sub: u._id.toString(), role: u.role || 'player' },
        JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.json({
        token,
        user: { id: u._id.toString(), username: u.username, email: u.email, role: u.role }
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?.sub;
        if (!userId) return res.status(401).json({ message: 'Non authentifié' });

        const u = await User.findById(userId);
        if (!u) return res.status(404).json({ message: 'Utilisateur introuvable' });
        res.json(u.toJSON());
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const userId = req.user?.sub;
        const role = req.user?.role || 'player';
        if (!userId) return res.status(401).json({ message: 'Non authentifié' });

        const token = jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};
