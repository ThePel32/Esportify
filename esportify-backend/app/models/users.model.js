// const bcrypt = require("bcrypt");
const sql = require("./db.js");

const User = function(user) {
  this.role = user.role;
  this.username = user.username;
  this.email = user.email;
  this.password = user.password;
  this.created_at = user.created_at;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (id, result) => {
  sql.query("SELECT * FROM users WHERE id = ?", [id], (err, res) => {
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


User.findByEmail = (email, result) => {
  sql.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
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

User.findByResetToken = (token, result) => {
  sql.query(`SELECT * FROM users WHERE resetPasswordToken = ?`, [token], (err, res) => {
    if(err){
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if(res.length){
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({kind: "not_found"}, null);
  });
};

User.getAll = (role, result) => {
  let query = "SELECT * FROM users";
  if (role) {
    query += ` WHERE role LIKE '%${role}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET role = ?, username = ?, email = ?, password = ?, created_at = ?, WHERE id = ?",
    [user.role, user.username, user.email, user.password, user.created_at, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
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

User.removeAll = (result) => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = User;
