const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");
exports.create = function(req, res) {
  const errors = validationResult(req);
  const { name, username, email, password, gender, id } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    User.findOne()
      .or([
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ])
      .then(user => {
        if (user === null) {
          User.create(
            {
              name,
              username,
              email: email.toLowerCase(),
              password,
              gender,
              id
            },
            err => {
              if (err) throw err;
              console.log(username + "user registered " + new Date());
              return res.status(200).json({ status: true, username });
            }
          );
        } else if (user.email.toLowerCase() == email.toLowerCase())
          return res.status(200).json({
            errors: [{ param: "email", msg: "Email is already registered" }]
          });
        else if (user.username.toLowerCase() == username.toLowerCase())
          return res.status(200).json({
            errors: [
              {
                param: "username",
                msg: "Username is already registered"
              }
            ]
          });
      });
  }
};
exports.login = function(req, res) {
  const errors = validationResult(req);
  const { username: email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  User.findOne()
    .or([
      { email: email.toLowerCase() },
      { username: new RegExp(`^${email}$`, "i") }
    ])
    .then(user => {
      if (!user)
        return res.status(200).json({
          errors: [{ param: "username", msg: "User does not exist" }]
        });
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res.status(200).json({
            errors: [{ param: "password", msg: "Password does not match" }]
          });
        jwt.sign(
          { id: user.id },
          process.env.JWTSECRET,
          {
            expiresIn: 36000 // 10 hours
          },
          (err, token) => {
            if (err) throw err;
            res.json({ status: true, token });
            console.log("user logged in " + email + " " + new Date());
          }
        );
      });
    });
};
exports.profile = function(req, res) {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function(err, user) {
    if (user) {
      User.findById(user.id)
        .select("-password")
        .then(user => {
          res.json({ user });
        });
    } else {
      res.json({ err });
    }
  });
};
