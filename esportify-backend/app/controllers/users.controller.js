const User = require("../models/users.model.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'boutique.gamestore@gmail.com',
//     pass: 'hjmq lhfy nwob ngrt '
//   }
// });

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = new User({
    username: req.body.username,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    created_at: req.body.created_at,
  });

  User.create(user, (err, data) => {
    if (err)
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

exports.signup = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = new User({
    role: req.body.role || 'user',
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    created_at: new Date(),
  });

  User.create(user, (err, data) => {
    if (err)
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    else res.send(data);
  });
};

exports.login = (req, res) => {

  User.findByEmail(req.body.email, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        return res.status(404).send({
          message: `Not found User with email ${req.body.email}.`
        });
      } else {
        return res.status(500).send({
          message: "Error retrieving User with email " + req.body.email
        });
      }
    } else {

      const passwordIsValid = bcrypt.compareSync(req.body.password, data.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: data.id }, '1a2z3e4r5t6y7u8i9o0p', {
        expiresIn: 86400
      });

      res.status(200).send({
        id: data.id,
        username: data.username,
        email: data.email,
        accessToken: token
      });
    }
  });
};

// exports.forgotPassword = (req, res) => {
//   const email = req.body.email;

//   User.findByEmail(email, (err, user) => {
//     if(err){

//       return res.status(404).send({message: 'User not found'});
//     }

//     const token = crypto.randomBytes(20).toString('hex');

//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000;

//     User.updateById(user.id, user, (err) => {
//       if(err){
//         return res.status(500).send({message: 'Error updating user'});
//       }

//       const mailOptions = {
//         from: 'boutique.gamestore@gmail.com',
//         to: email,
//         subject: 'Réinitialisation du mot de passe',
//         text: `Vous recevez ce message parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n
//     Veuillez cliquer sur le lien suivant, ou le copier dans votre navigateur pour compléter le processus :\n\n
//     http://localhost:3000/reset-password/${token}\n\n
//     Si vous n'avez pas demandé cela, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`
//       };

//       transporter.sendMail(mailOptions, (error) => {
//         if(error){
//           return res.status(500).send({message: 'Error sending email'});
//         }
//         res.status(200).send({message: 'Email sent'});
//       });
//     });
//   });
// };

// exports.resetPassword = (req, res) => {
//   const {token, newPassword} = req.body;

//   User.findByResetToken(token, (err, user) => {
//     if (err || !user || user.resetPasswordExpires < Date.now()){
//       return res.status(400).send({message: 'Password reset token is invalid or has expired.'});
//     }

//     user.password = bcrypt.hashSync(newPassword, 10);
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;

//     User.updateById(user.id, user, (err) => {
//       if (err){
//         return res.status(500).send({message: 'Error updating password'});
//       }
//       res.status(200).send({message: 'Password has been updated'});
//     });
//   });
// };

exports.logout = (req, res) => {
  const token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(400).send({ message: "No token provided." });
  }
    delete req.headers["x-access-token"];
  
  if (req.headers["x-access-token"]) {
    return res.status(500).send({ message: "Failed to delete token." });
  }
  res.status(200).send({ message: "Logout successful." });
};

exports.getUserProfile = (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "no token provided!" });
  }

  jwt.verify(token, '1a2z3e4r5t6y7u8i9o0p', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    User.findById(decoded.id, (err, user) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({ message: "User not found" });
        } else {
          res.status(500).send({ message: "Error retrieving user." });
        }
      } else {
        res.status(200).send(user);
      }
    });
  });
};

exports.findAll = (req, res) => {
  const role = req.query.role;

  User.getAll(role, (err, data) => {
    if (err)
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.id,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          return res.status(500).send({
            message: "Error updating User with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: "Could not delete User with id " + req.params.id
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      return res.status(500).send({
        message: err.message || "Some error occurred while removing all users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};
