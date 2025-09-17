const db = require('../config/db');

const Event = function (event) {
    this.title = event.title;
    this.description = event.description;
    this.date_time = event.date_time;
    this.max_players = event.max_players;
    this.organizer_id = event.organizer_id;
    this.state = event.state || 'pending';
    this.started = event.started || 0;
    this.images = event.images;
    this.duration = event.duration;
    this.created_at = event.created_at || new Date();
    this.updated_at = event.updated_at || new Date();
};

Event.create = async (newEvent) => {
    const res = await db.query(`INSERT INTO events SET ?`, [newEvent]);
    return { id: res.insertId, ...newEvent };
};

Event.findById = async (id) => {
    const rows = await db.query(
        `
        SELECT e.*, u.username AS organizer_name
        FROM events e
        LEFT JOIN users u ON e.organizer_id = u.id
        WHERE e.id = ?
        `,
        [id]
    );
    return rows[0] || null;
};

Event.getByState = async (state) => {
    const rows = await db.query(`SELECT * FROM events WHERE state = ?`, [state]);
    return rows;
};

Event.getAll = async (title, state) => {
    const where = [];
    const params = [];

    if (state) {
        where.push(`events.state = ?`);
        params.push(state);
    }
    if (title) {
        where.push(`events.title LIKE ?`);
        params.push(`%${title}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const rows = await db.query(
        `
        SELECT
        events.*,
        organizer.username AS organizer_name,
        GROUP_CONCAT(
            DISTINCT CONCAT(
            '{"id":', users.id,
            ',"username":"', users.username,
            '","has_joined":', IFNULL(event_participants.has_joined, 0), '}'
            )
        ) AS participants
        FROM events
        LEFT JOIN event_participants ON events.id = event_participants.event_id
        LEFT JOIN users ON event_participants.user_id = users.id
        JOIN users AS organizer ON events.organizer_id = organizer.id
        ${whereSql}
        GROUP BY events.id
        ORDER BY events.date_time DESC
        `,
        params
    );

    return rows.map((e) => {
        let participants = [];
        if (typeof e.participants === 'string' && e.participants.trim() !== '') {
        try {
            participants = JSON.parse(`[${e.participants}]`).map((p) => ({
            ...p,
            has_joined: p.has_joined === 1 || p.has_joined === true,
            }));
        } catch {
            participants = [];
        }
        }
        return { ...e, participants };
    });
};

Event.updateById = async (id, event) => {
    const res = await db.query(
        `
        UPDATE events
        SET title = ?, description = ?, date_time = ?, max_players = ?, organizer_id = ?, state = ?,
            images = ?, duration = ?, started = ?, updated_at = ?
        WHERE id = ?
        `,
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
        id,
        ]
    );
    if (!res.affectedRows) return null;
    return { id, ...event };
};

Event.remove = async (id) => {
    const res = await db.query(`DELETE FROM events WHERE id = ?`, [id]);
    if (!res.affectedRows) return null;
    return { id };
};

Event.removeAll = async () => {
    await db.query(`DELETE FROM events`);
    return true;
};

Event.startById = async (id) => {
    const res = await db.query(
        `UPDATE events SET started = TRUE, updated_at = ? WHERE id = ?`,
        [new Date(), id]
    );
    if (!res.affectedRows) return null;
    return { id, started: true };
};

Event.getFinishedEvents = async () => {
    const now = new Date();
    const rows = await db.query(
        `
        SELECT e.*, u.username AS organizer_name
        FROM events e
        LEFT JOIN users u ON e.organizer_id = u.id
        WHERE DATE_ADD(e.date_time, INTERVAL e.duration HOUR) < ?
        AND e.state = 'validated'
        `,
        [now]
    );
    return rows;
};

Event.getUserFinishedEvents = async (userId) => {
    const now = new Date();
    const rows = await db.query(
        `
        SELECT e.*, u.username AS organizer_name
        FROM events e
        LEFT JOIN users u ON e.organizer_id = u.id
        INNER JOIN event_participants ep ON ep.event_id = e.id
        WHERE ep.user_id = ?
        AND DATE_ADD(e.date_time, INTERVAL e.duration HOUR) < ?
        AND e.state = 'validated'
        `,
        [userId, now]
    );
    return rows;
};

module.exports = Event;
