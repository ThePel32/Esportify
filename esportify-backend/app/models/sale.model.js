const sql = require("./db.js");

const Sale = function(sale){
    this.date = sale.date;
    this.gameGender = sale.gameGender;
    this.gameName = sale.gameName;
    this.quantity = sale.quantity
};

Sale.create = (newSale, result) => {
    sql.query("INSERT INTO sale SET ?", newSale, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newSale});
    });
};

Sale.findById = (id, result) => {
    sql.query(`SELECT * FROM sale WHERE id = ${id}`, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        if(res.length){
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

Sale.getAll = (date, result) => {
    let query = "SELECT * FROM sale";

    if(date){
        query += `WHERE date LIKE '%${date}%'`;
    }

    sql.query(query, (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Sale.updateById = (id, sale, result) => {
    sql.query(
        "UPDATE sale SET date = ?, gameGender = ?, gameName = ?, quantity = ? WHERE id = ?",
        [sale.date, sale.gameGender, sale.gameName, sale.quantity, id],
        (err, res) => {
            if(err){
                result(null, err);
                return;
            }

            if(res.affectedRows == 0){
                result({kind: "not_found"}, null);
                return;
            }
            result(null, {id: id, ...sale});
        }
    );
};

Sale.remove = (id, result) => {
    sql.query("DELETE FROM sale WHERE id = ?", id, (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        if(res.affectedRows == 0){
            // not found sale with the id
            result({kind: "not_found"}, null);
            return;
        }
        result(null, res);
    });
};

Sale.removeAll = (result) => {
    sql.query("DELETE FROM sale", (err, res) => {
        if(err){
            result(null, err);
            return;
        }
        result(null, res);
    });
};

module.exports = Sale; 