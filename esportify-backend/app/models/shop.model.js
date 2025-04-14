const sql = require("../config/db");

const Shop = function(shop) {
    this.name = shop.name;
    this.adress = shop.adress;
    this.zipCode = shop.zipCode;
    this.city = shop.city;
};

Shop.create = (newShop, result) => {
    sql.query("INSERT INTO shop SET ?", newShop, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newShop});
    });
};

Shop.findById = (id, result) => {
    sql.query(`SELECT * FROM shop WHERE id = ${id}`, (err, res) => {
        if(err){
            result=(err, null);
            return;
        }
        if (res.length){
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

Shop.getAll = (name, result) => {
    let query = "SELECT * FROM shop";

    if(name){
        query += `WHERE name LIKE '%${name}%'`;
    }

    sql.query(query, (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Shop.updateById = (id, shop, result) => {
    sql.query(
        "UPDATE shop SET name = ?, adress = ?, zipCode = ?, city = ? WHERE id = ?",
        [shop.name, shop.adress, shop.zipCode, shop.city, id],
        (err, res) => {
            if(err){
                result(null, err);
                return;
            }
            if(res.affectedRows == 0){
                result({kind: "not_found"}, null);
                return;
            }
            result(null, {id: id, ...shop});
        }
    );
};

Shop.remove = (id, result) => {
    sql.query("DELETE FROM shop WHERE id = ?", id, (err, res) => {
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

Shop.removeAll = (result) => {
    sql.query("DELETED FROM shop", (err, res) => {
        if(err){
            result(null,err);
            return;
        }
        result(null, res);
    });
};

module.exports = Shop;