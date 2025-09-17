require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, username: user.username },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });

        console.log('[AUTH] login via MySQL', { email });

        const rows = await query(
        'SELECT id, username, email, password, role FROM users WHERE email = ? LIMIT 1',
        [email]
        );
        if (!rows.length) {
        console.log('[AUTH] login: user not found', { email });
        return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password || '');
        if (!ok) {
        console.log('[AUTH] login: bad password', { email });
        return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const token = signToken(user);
        return res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
        });
    } catch (e) {
        console.error('[AUTH] login error', e);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role = 'user' } = req.body || {};
        if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email et password sont requis.' });
        }

        const exists = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
        if (exists.length) return res.status(409).json({ message: 'Un compte existe déjà avec cet email.' });

        const hash = await bcrypt.hash(password, 10);
        const result = await query(
        'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
        [username, email, hash, role]
        );

        const user = { id: result.insertId, username, email, role };
        const token = signToken(user);
        return res.status(201).json({ token, user });
    } catch (e) {
        console.error('[AUTH] signup error', e);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const token = signToken(req.user);
        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const rows = await query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1',
        [req.user.id]
        );
    if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    const u = rows[0];
    return res.json({
        user: {
            id: u.id,
            username: u.username,
            pseudo: u.username,
            email: u.email,
            role: u.role,
            created_at: u.created_at,
            createdAt: u.created_at
        }
        });
    } catch (e) {
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

