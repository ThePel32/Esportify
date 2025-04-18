const db = require('../config/db');

exports.banUser = (eventId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO event_bans (event_id, user_id, banned_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE banned_at = NOW()
        `;
        db.query(query, [eventId, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.isUserBanned = (eventId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * FROM event_bans
        WHERE event_id = ? AND user_id = ?
        `;
        db.query(query, [eventId, userId], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0);
        });
    });
};

exports.getBannedUsers = (eventId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT users.id, users.username FROM event_bans
        JOIN users ON event_bans.user_id = users.id
        WHERE event_bans.event_id = ?
      `;
      db.query(query, [eventId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };
  

exports.unbanUser = (eventId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM event_bans WHERE event_id = ? AND user_id = ?
        `;
        db.query(query, [eventId, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.isUserBannedFromGame = (gameKey, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT eb.*
        FROM event_bans eb
        JOIN events e ON eb.event_id = e.id
        WHERE LOWER(e.title) = LOWER(?)
        AND eb.user_id = ?
      `;
  
      db.query(query, [gameKey, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  };
  
  
