const { query, getPool } = require("../config/db");

const User = {
    async create(newUser) {
        const result = await query("INSERT INTO users SET ?", [newUser]);
        return { id: result.insertId, ...newUser };
    },

    async findById(id) {
        const rows = await query("SELECT * FROM users WHERE id = ?", [id]);
        return rows[0] || null;
    },

    async findByEmail(email) {
        const rows = await query(
            "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
            [email]
        );
        return rows[0] || null;
    },

    async findByResetToken(token) {
        const rows = await query(
            "SELECT * FROM users WHERE resetPasswordToken = ?",
            [token]
        );
        return rows[0] || null;
    },

    async getAll(role) {
        let sql = "SELECT * FROM users";
        const params = [];
        if (role) {
            sql += " WHERE role LIKE ?";
            params.push(`%${role}%`);
        }
        return query(sql, params);
    },

    async updateById(id, userData) {
        const fields = [];
        const values = [];

        const allowed = ["role", "username", "email", "password", "created_at"];
        for (const key of allowed) {
            if (userData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(userData[key]);
            }
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        const res = await query(sql, values);

        if (!res.affectedRows) return null;
        return this.findById(id);
    },

    async findByIdAndUpdate(id, updateData) {
        const res = await query("UPDATE users SET role = ? WHERE id = ?", [
            updateData.role,
            id,
        ]);
        if (!res.affectedRows) return null;
        return { id, role: updateData.role };
    },

    getAllByRoles(roles, result) {
        (async () => {
            try {
                const placeholders = roles.map(() => "?").join(",");
                const rows = await query(
                    `SELECT id, username FROM users WHERE role IN (${placeholders})`,
                    roles
                );
                result(null, rows);
            } catch (err) {
                result(err, null);
            }
        })();
    },

    async remove(id) {
        const pool = getPool();
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const deletes = [
                ["DELETE FROM chat_messages WHERE user_id = ?", [id]],
                ["DELETE FROM event_participants WHERE user_id = ?", [id]],
                ["DELETE FROM favorites WHERE user_id = ?", [id]],
                ["DELETE FROM scores WHERE user_id = ?", [id]],
                ["DELETE FROM event_bans WHERE user_id = ?", [id]],
            ];

            for (const [sql, params] of deletes) {
                await conn.query(sql, params);
            }

            const [res] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
            if (!res.affectedRows) {
                throw { kind: "not_found", message: `Utilisateur introuvable avec l'id ${id}.` };
            }

            await conn.commit();
            return { message: "Utilisateur supprimé avec succès" };
        } catch (err) {
            try { await conn.rollback(); } catch { }
            throw err;
        } finally {
            conn.release();
        }
    },

    async removeAll() {
        await query("DELETE FROM users");
        return { message: "Tous les utilisateurs ont été supprimés avec succès" };
    },
};

module.exports = User;
