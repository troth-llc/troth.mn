const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.info = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const { name, username, website, gender, about } = req.body;
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    if (user) {
      User.findById(user.id).then((data) => {
        User.findOne({ username: new RegExp(`^${username}$`, "i") }).then(
          (user) => {
            if (user === null || user.username === data.username) {
              data.name = name;
              data.username = username;
              data.website = website;
              data.gender = gender;
              data.about = about;
              data.updated = new Date();
              data.save((err) => {
                if (err) return res.json({ status: false, msg: err });
                return res.json({ status: true });
              });
            } else
              return res.json({
                status: false,
                errors: [
                  {
                    param: "username",
                    msg: "invalid username.",
                  },
                ],
              });
          }
        );
      });
    } else {
      res.json({ err });
    }
  });
};
exports.password = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const { old, confirm } = req.body;
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    User.findById(user.id).then((data) => {
      bcrypt.compare(old, data.password).then((isMatch) => {
        if (!isMatch)
          return res.json({
            status: false,
            errors: [{ msg: "Password does not match", param: "old" }],
          });
        else {
          data.password = confirm;
          data.password_updated = new Date();
          data.save((err) => {
            if (err) return res.json({ status: false, msg: err });
            return res.json({ status: true });
          });
        }
      });
    });
  });
};
