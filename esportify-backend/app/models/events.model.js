const sql = require("./db.js");

const Event = function(event) {
    this.title = event.title;
    this.description = event.description;
    this.date_time = event.date_time;
    this.max_players = event.max_players;
    this.organizer_id = event.organizer_id;
    this.state = event.state;
    this.images = event.images;
    this.created_at = event.created_at;
    this.updated_at = event.updated_at;
};

Event.create = (newEvent, result) => {
    sql.query("INSERT INTO events SET ?", newEvent, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newEvent});
    });
};

Event.findById = (id, result) => {
    sql.query(`SELECT * FROM events WHERE id = ${id}`, (err, res) => {
        if(err){
            result=(err, null);
            return;
        }
        if(res.length){
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

Event.getAll = (title, result) => {
    let query = "SELECT * FROM events";

    if(title){
        query +=`WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Event.updateById = (id, event, result) => {
    sql.query(
        "UPDATE events SET title = ?, description = ?, date_time = ?, max_players = ?, organizer_id = ?, state = ?, images = ?, created_at = ?, updated_at = ?",
        [
            event.title, 
            event.description, 
            event.date_time, 
            event.max_players, 
            event.organizer_id, 
            event.state, 
            event.images, 
            event.created_at, 
            event.updated_at
        ],
        (err, res) => {
            if(err){
                result(null, err);
                return;
            };
            if(res.affectedRows == 0){
                result({kind: "not_found"}, null);
                return;
            }
            result(null, {id: id, ...event});
        }
    );
};

Event.remove = (id, result) => {
    sql.query("DELETE FROM events WHERE id = ?", id, (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }
        result(null, res);
    });
};

Event.removeAll = (result) => {
    sql.query("DELETED FROM events", (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        result(null, res);
    });
};

module.exports = Event; 
