const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/mongo/user.model');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('[AUTH] JWT_SECRET absent !');
}

console.log('[AUTH] Controller Mongo chargé');

exports.signup = async (req, res, next) => {
    console.log('[auth] signup', req.body?.email);
    console.log('[AUTH] signup via Mongo', { username: req.body?.username, email: req.body?.email, role: req.body?.role });

    try {
        const { username, email, password, role } = req.body;
        const u = new User({ username, email, password, role });
        await u.save();
        console.log('[AUTH] signup OK', { id: u._id.toString(), email: u.email });
        res.status(201).json(u.toJSON());
    } catch (err) {
        if (err.code === 11000) {
        console.warn('[AUTH] signup conflit (dup key)', err.keyValue);
        return res.status(409).json({ message: 'Email ou username déjà utilisé' });
        }
        console.error('[AUTH] signup error', err);
        next(err);
    }
};

exports.login = async (req, res, next) => {
    console.log('[auth] login', req.body?.email);
    console.log('[AUTH] login via Mongo', { email: req.body?.email });

    try {
        const { email, password } = req.body;

        const u = await User.findOne({ email }).select('+password');
        if (!u) {
        console.warn('[AUTH] login: user not found', { email });
        return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const ok = await bcrypt.compare(password, u.password);
        console.log('[AUTH] login: password', ok ? 'OK' : 'KO', { email });

        if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

        const token = jwt.sign(
        { sub: u._id.toString(), role: u.role || 'player' },
        JWT_SECRET,
        { expiresIn: '7d' }
        );

        console.log('[AUTH] login OK', { id: u._id.toString(), email: u.email });
        res.json({
        token,
        user: { id: u._id.toString(), username: u.username, email: u.email, role: u.role }
        });
    } catch (err) {
        console.error('[AUTH] login error', err);
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    console.log('[AUTH] profile', { userId: req.user?.sub });

    try {
        const userId = req.user?.sub;
        if (!userId) return res.status(401).json({ message: 'Non authentifié' });

        const u = await User.findById(userId);
        if (!u) return res.status(404).json({ message: 'Utilisateur introuvable' });

        res.json(u.toJSON());
    } catch (err) {
        console.error('[AUTH] profile error', err);
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    console.log('[AUTH] refresh-token', { userId: req.user?.sub });

    try {
        const userId = req.user?.sub;
        const role = req.user?.role || 'player';
        if (!userId) return res.status(401).json({ message: 'Non authentifié' });

        const token = jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        console.error('[AUTH] refresh-token error', err);
        next(err);
    }
};
