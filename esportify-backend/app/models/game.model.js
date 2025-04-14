const sql = require("../config/db");

const Game = function(game) {
    this.name = game.name;
    this.pegi = game.pegi;
    this.description = game.description;
    this.price = game.price;
    this.quantity = game.quantity;
    this.image_path = game.image_path;
    this.gender = game.gender;
  };

  Game.create = (newGame, result) => {
    sql.query("INSERT INTO game SET ?", newGame, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newGame});
    });
  };

  Game.findById = (id, result) => {
    sql.query(`SELECT * FROM game WHERE id = ${id}`, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        if(res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found"}, null);
    });
  };

  Game.getAll = (name, result) => {
    let query = "SELECT * FROM game";

    if(name){
        query += `WHERE name LIKE '%${name}%'`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            result(null,err);
            return;
        }
        result(null, res);
    });
  };

  Game.updateById = (id, game, result) => {
    sql.query(
        "UPDATE game SET name = ?, pegi = ?, description = ?, price = ?, quantity = ?, image_path = ?, gender = ? WHERE id = ?",
        [game.name, game.pegi, game.description, game.price, game.quantity, game.image_path, game.gender, id], 
        (err, res) => {
            if(err){
                result(null, err);
                return;
            }
            if(res.affectedRows == 0){
                result({kind: "not_found"}, null);
                return;
            };
        }
    );
  };

  Game.remove = (id, result) => {
    sql.query("DELETE FROM game WHERE id = ?", id, (err, res) => {
        if (err){
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

  Game.removeALl = (result) => {
    sql.query("DELETED FROM game", (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        result(null, res);
    });
  };

  module.exports = Game;