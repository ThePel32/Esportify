const User = require("../models/users.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Content can not be empty!"
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
            message: err.message || "Some error occurred while creating the User."
        });
        else res.send(data);
    });
};


exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).send({ message: "Email already in use!" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = { username, role: "user", email, password: hashedPassword, created_at: new Date() };
        const userData = await User.create(newUser);

        res.status(201).send({ message: "User registered successfully!", user: userData });

    } catch (error) {
        res.status(500).send({ message: error.message || "Error during signup." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required!" });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid password!" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).send({
            message: "Login successful!",
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Error during login." });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const oldToken = req.headers["authorization"]?.split(" ")[1];
        if (!oldToken) {
            return res.status(403).send({ message: "No token provided!" });
        }


        jwt.verify(oldToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized or token expired!" });
            }


            const newToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );


            res.status(200).send({ token: newToken });
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Error during token refresh." });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(403).send({ message: "No user ID found!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        res.status(500).send({ message: "Error retrieving user profile" });
    }
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
            return res.status(404).send({ message: `User not found with id ${req.params.id}.` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving user." });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedUser = await User.updateById(id, updatedData);
        if (!updatedUser) {
            return res.status(404).send({ message: `User not found with id ${id}.` });
        }

        res.status(200).json({ message: "User updated successfully!", updatedUser });
    } catch (error) {
        res.status(500).send({ message: "Error updating user." });
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
    findAll: exports.findAll,
    findOne: exports.findOne,
    update: exports.update,
    updateRole: exports.updateRole,
    create: exports.create,
    delete: exports.delete,
    deleteAll: exports.deleteAll
};