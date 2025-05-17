const db = require("../config/db");

const User = {
    create: (newUser) => {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO users SET ?", newUser, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: res.insertId, ...newUser });
                }
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [id], (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.length) {
                    resolve(res[0]);
                } else {
                    reject({ kind: "not_found" });
                }
            });
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email], (err, results) => {
                if (err) {
                    console.error("Erreur SQL :", err);
                    reject(err);
                } else if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    findByResetToken: (token) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE resetPasswordToken = ?", [token], (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.length) {
                    resolve(res[0]);
                } else {
                    reject({ kind: "not_found" });
                }
            });
        });
    },

    getAll: (role) => {
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM users";
            let params = [];

            if (role) {
                query += " WHERE role LIKE ?";
                params.push(`%${role}%`);
            }

            db.query(query, params, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },

    updateById: (id, userData) => {
        return new Promise((resolve, reject) => {
            db.query(
                "UPDATE users SET role = ?, username = ?, email = ?, password = ?, created_at = ? WHERE id = ?",
                [userData.role, userData.username, userData.email, userData.password, userData.created_at, id],
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else if (res.affectedRows == 0) {
                        reject({ kind: "not_found" });
                    } else {
                        resolve({ id, ...userData });
                    }
                }
            );
        });
    },

    findByIdAndUpdate: (id, updateData) => {
        return new Promise((resolve, reject) => {
            db.query("UPDATE users SET role = ? WHERE id = ?", [updateData.role, id], (err, res) => {
                if (err) {
                    reject(err);
                } else if (res.affectedRows == 0) {
                    reject({ kind: "not_found" });
                } else {
                    resolve({ id, role: updateData.role });
                }
            });
        });
    },

    getAllByRoles: (roles, result) => {
        const placeholders = roles.map(() => '?').join(',');
        db.query(`SELECT id, username FROM users WHERE role IN (${placeholders})`, roles, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            const sql = require("../config/db");
    
            const queries = [
                "DELETE FROM event_participants WHERE user_id = ?",
                "DELETE FROM favorites WHERE user_id = ?",
                "DELETE FROM scores WHERE user_id = ?",
                "DELETE FROM event_bans WHERE user_id = ?"
            ];
    
            Promise.all(queries.map(q => 
                new Promise((res, rej) => {
                    sql.query(q, [id], (err) => {
                        if (err) return rej(err);
                        res();
                    });
                })
            ))
            .then(() => {
                sql.query("DELETE FROM users WHERE id = ?", [id], (err, res) => {
                    if (err) {
                        reject(err);
                    } else if (res.affectedRows == 0) {
                        reject({ message: `Utilisateur introuvable avec l'id ${id}.` });
                    } else {
                        resolve({ message: "Utilisateur supprimé avec succès" });
                    }
                });
            })
            .catch(reject);
        });
    },
    

    removeAll: () => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM users", (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: "Tous les utilisateurs ont été supprimés avec succès" });
                }
            });
        });
    }
};

module.exports = User;
