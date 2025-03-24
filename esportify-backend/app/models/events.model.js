const sql = require("./db.js");

const Event = function(event) {
    this.title = event.title;
    this.description = event.description;
    this.date_time = event.date_time;
    this.max_players = event.max_players;
    this.organizer_id = event.organizer_id;
    this.state = event.state || "pending";
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
            console.error("❌ Erreur lors de l'exécution de la requête SQL :", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Event.getAll = (title, state, result) => {
    let query = `
        SELECT events.*, 
        (SELECT COUNT(*) FROM event_participants WHERE event_participants.event_id = events.id) AS nb_participants,
        GROUP_CONCAT(DISTINCT CONCAT('{"id":', users.id, ',"username":"', users.username, '"}')) AS participants
        FROM events
        LEFT JOIN event_participants ON events.id = event_participants.event_id
        LEFT JOIN users ON event_participants.user_id = users.id
        WHERE events.state = ?
        GROUP BY events.id
    `;

    sql.query(query, [state], (err, res) => {
        if (err) {
            console.error("❌ Erreur SQL dans getAll:", err);
            result(err, null);
            return;
        }

        const events = res.map(event => ({
            ...event,
            participants: event.participants ? JSON.parse(`[${event.participants}]`) : []
        }));

        result(null, events);
    });
};

Event.updateById = (id, event, result) => {
    sql.query(
        "UPDATE events SET title = ?, description = ?, date_time = ?, max_players = ?, organizer_id = ?, state = ?, images = ?, updated_at = ? WHERE id = ?",
        [
            event.title, 
            event.description, 
            event.date_time, 
            event.max_players, 
            event.organizer_id, 
            event.state,
            event.images, 
            event.duration,
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

module.exports = Event;
