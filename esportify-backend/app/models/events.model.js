const sql = require("../config/db.js");

const Event = function(event) {
    this.title = event.title;
    this.description = event.description;
    this.date_time = event.date_time;
    this.max_players = event.max_players;
    this.organizer_id = event.organizer_id;
    this.state = event.state || "pending";
    this.started = event.started || false;
    this.images = event.images;
    this.duration = event.duration;
    this.created_at = new Date();
    this.updated_at = new Date();
};

Event.create = (newEvent, result) => {
    sql.query("INSERT INTO events SET ?", newEvent, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newEvent });
    });
};

Event.findById = (id, result) => {
    sql.query("SELECT * FROM events WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Event.getByState = (state, result) => {

    let query = "SELECT * FROM events WHERE state = ?";

    sql.query(query, [state], (err, res) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête SQL :", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

    Event.getAll = (title, state, result) => {
        const query = `
        SELECT events.*, 
            organizer.username AS organizer_name,
            GROUP_CONCAT(DISTINCT CONCAT(
            '{"id":', users.id,
            ',"username":"', users.username,
            '","has_joined":', IFNULL(event_participants.has_joined, 0),
            '}'
            )) AS participants
        FROM events
        LEFT JOIN event_participants ON events.id = event_participants.event_id
        LEFT JOIN users ON event_participants.user_id = users.id
        JOIN users AS organizer ON events.organizer_id = organizer.id
        WHERE events.state = ?
        GROUP BY events.id
        `;
    
        sql.query(query, [state], (err, res) => {
        if (err) {
            console.error("Erreur SQL dans getAll:", err);
            return result(err, null);
        }
    
        const cleaned = res.map(event => {
            let participants = [];
    
            if (typeof event.participants === 'string' && event.participants.trim() !== '') {
            try {
                participants = JSON.parse(`[${event.participants}]`).map(p => ({
                ...p,
                has_joined: p.has_joined === 1 || p.has_joined === true
                }));
            } catch (parseError) {
                console.error("Erreur de parsing JSON participants:", parseError);
            }
            }
    
            return {
            ...event,
            participants
            };
        });
    
        result(null, cleaned);
        });
    };

Event.updateById = (id, event, result) => {
    sql.query(
        "UPDATE events SET title = ?, description = ?, date_time = ?, max_players = ?, organizer_id = ?, state = ?, images = ?, duration = ?,started = ?, updated_at = ? WHERE id = ?",
        [
            event.title, 
            event.description, 
            event.date_time, 
            event.max_players, 
            event.organizer_id, 
            event.state,
            event.images, 
            event.duration,
            event.started,
            new Date(),
            id
        ],
        (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { id: id, ...event });
        }
    );
};

Event.remove = (id, result) => {
    sql.query("DELETE FROM events WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

Event.removeAll = (result) => {
    sql.query("DELETE FROM events", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Event.startById = (id, result) => {
    sql.query(
        "UPDATE events SET started = true, updated_at = ? WHERE id = ?",
        [new Date(), id],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            
            if (res.affectedRows == 0) {
                return;
            }
            result(null, {id: id, started: true})
        }
    );
};

Event.getFinishedEvents = (result) => {
    const now = new Date();
    sql.query(
        `SELECT e.*, u.username as organizer_name
            FROM events e
            LEFT JOIN users u ON e.organizer_id = u.id
            WHERE DATE_ADD(e.date_time, INTERVAL e.duration HOUR) < ? AND e.state = 'validated'`,
        [now],
        (err, res) => {
            if (err) return result(err, null);
        result(null, res);
        }
    );
};

Event.getUserFinishedEvents = (userId, result) => {
    const now = new Date();
    sql.query(
        `SELECT e.*, u.username as organizer_name
        FROM events e
        LEFT JOIN users u ON e.organizer_id = u.id
        INNER JOIN event_participants ep ON ep.event_id = e.id
        WHERE ep.user_id = ? AND DATE_ADD(e.date_time, INTERVAL e.duration HOUR) < ? AND e.state = 'validated'`,
        [userId, now],
        (err, res) => {
            if (err) return result(err, null);
            result(null, res);
        }
    );
};


module.exports = Event;
