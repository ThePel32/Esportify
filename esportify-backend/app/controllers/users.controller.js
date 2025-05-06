const User = require("../models/users.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Le contenu ne peut pas être vide !"
        });
    }

    const user = new User({
        username: req.body.username,
        role: "user",
        email: req.body.email,
        password: req.body.password,
        created_at: req.body.created_at,
    });

    User.create(user, (err, data) => {
        if (err)
        return res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
        });
        else res.send(data);
    });
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: "Tous les champs sont obligatoires !" });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).send({ message: "Email déjà utilisé !" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = { username, role: "user", email, password: hashedPassword, created_at: new Date() };
        const userData = await User.create(newUser);

        res.status(201).send({ message: "Utilisateur enregistré avec succès !", user: userData });

    } catch (error) {
        res.status(500).send({ message: error.message || "Erreur lors de l'inscription." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "L'email et le mot de passe sont obligatoires !" });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable !" });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Mot de passe invalide !" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).send({
            message: "Connexion réussie !",
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Erreur lors de la connexion." });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const oldToken = req.headers["authorization"]?.split(" ")[1];
        if (!oldToken) {
            return res.status(403).send({ message: "Aucun token fourni !" });
        }

        jwt.verify(oldToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Token non autorisé ou expiré !" });
            }

            const newToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(200).send({ token: newToken });
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Erreur lors de l'actualisation du token." });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(403).send({ message: "Aucun identifiant d'utilisateur trouvé!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable" });
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        });

    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération du profil utilisateur" });
    }
};

exports.findAllOrganizers = (req, res) => {
    User.getAllByRoles(['organizer', 'admin'], (err, data) => {
        if (err)
            res.status(500).send({ message: err.message || "Erreur lors de la récupération des organisateurs." });
        else res.json(data);
    });
};

exports.findAll = async (req, res) => {
    try {
        const users = await User.getAll();

        const formattedUsers = users.map(({ id, username, email, role, created_at }) => ({
            id,
            username,
            email,
            role,
            created_at
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des utilisateurs." });
    }
};

exports.findOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: `Utilisateur non trouvé avec l'id ${req.params.id}.` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération de l'utilisateur." });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedUser = await User.updateById(id, updatedData);
        if (!updatedUser) {
            return res.status(404).send({ message: `Utilisateur non trouvé avec l'id ${id}.` });
        }

        res.status(200).json({ message: "L'utilisateur a été mis à jour avec succès!", updatedUser });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la mise à jour de l'utilisateur." });
    }
};

exports.updateRole = async (req, res) => {
    const userId = req.params.id; 
    const newRole = req.body.role;

    if (!newRole) {
        return res.status(400).send({ message: "Le rôle est requis !" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole });
        if (!updatedUser) {
            return res.status(404).send({ message: "Utilisateur non trouvé" });
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rôle:", error);
        res.status(500).send({ message: "Erreur lors de la mise à jour du rôle" });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ message: "Le nouveau mot de passe est requis !" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const sql = require("../config/db.js");
        sql.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, id],
            (err, result) => {
                if (err) {
                    console.error("Erreur SQL lors de la mise à jour du mot de passe :", err);
                    return res.status(500).send({ message: "Erreur SQL" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).send({ message: `Utilisateur non trouvé avec l'id ${id}.` });
                }

                res.status(200).send({ message: "Mot de passe mis à jour avec succès !" });
            }
        );
    } catch (error) {
        console.error("Erreur MAJ mot de passe :", error);
        res.status(500).send({ message: "Erreur lors de la mise à jour du mot de passe." });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.remove(id);
        if (!deleted) {
            return res.status(404).send({ message: `User not found with id ${id}.` });
        }
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting user." });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await User.removeAll();
        res.status(200).json({ message: "All users deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting all users." });
    }
};

module.exports = {
    signup: exports.signup,
    login: exports.login,
    refreshToken: exports.refreshToken,
    getUserProfile: exports.getUserProfile,
    findAllOrganizers: exports.findAllOrganizers,
    findAll: exports.findAll,
    findOne: exports.findOne,
    update: exports.update,
    updateRole: exports.updateRole,
    updatePassword: exports.updatePassword,
    create: exports.create,
    delete: exports.delete,
    deleteAll: exports.deleteAll
};