const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
exports.create = function (req, res) {
  const errors = validationResult(req);
  const { name, username, email, password, gender, id } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    User.findOne()
      .or([
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ])
      .then((user) => {
        if (user === null) {
          User.create(
            {
              name,
              username: username.toLowerCase(),
              email: email.toLowerCase(),
              password,
              gender,
              id,
            },
            (err) => {
              if (err) throw err;
              console.log(username + " user registered " + new Date());
              return res.status(200).json({ status: true, username });
            }
          );
        } else if (user.email.toLowerCase() == email.toLowerCase())
          return res.status(200).json({
            errors: [{ param: "email", msg: "Email is already registered" }],
          });
        else if (user.username.toLowerCase() == username.toLowerCase())
          return res.status(200).json({
            errors: [
              {
                param: "username",
                msg: "Username is already registered",
              },
            ],
          });
      });
  }
};
exports.login = function (req, res) {
  const errors = validationResult(req);
  const { username: email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  User.findOne()
    .or([
      { email: email.toLowerCase() },
      { username: new RegExp(`^${email}$`, "i") },
    ])
    .then((user) => {
      if (!user)
        return res.status(200).json({
          errors: [{ param: "username", msg: "User does not exist" }],
        });
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(200).json({
            errors: [{ param: "password", msg: "Password does not match" }],
          });
        jwt.sign(
          { id: user.id },
          process.env.JWTSECRET,
          {
            expiresIn: 36000, // 10 hours
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
exports.profile = function (req, res) {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    if (user) {
      User.findById(user.id)
        .select("-password")
        .then((user) => {
          res.json({
            user: {
              _id: user._id,
              email: user.email,
              email_verified_at: user.email_verified_at,
              password_updated_at: user.password_updated_at,
              username: user.username,
              avatar: user.avatar,
              verified: user.verified,
              type: user.type,
              badges: user.badges,
              projects: user.projects,
              name: user.name,
              gender: user.gender,
              website: user.website,
              about: user.about,
              created: user.created,
              updated: user.updated,
              phone: user.phone,
              password_updated: user.password_updated,
              following: user.following.length,
              followers: user.followers.length,
            },
          });
        });
    } else {
      res.json({ err });
    }
  });
};
exports.forgot = function (req, res) {
  const errors = validationResult(req);
  const { username: email } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    User.findOne()
      .or([
        { email: email.toLowerCase() },
        { username: new RegExp(`^${email}$`, "i") },
      ])
      .then((user) => {
        if (!user)
          return res.status(200).json({
            errors: [{ param: "username", msg: "User does not exist" }],
          });
        else {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.MAIL,
              pass: process.env.MAIL_PASSWORD,
              type: "login",
            },
          });
          crypto.randomBytes(20, function (err, buffer) {
            var token = buffer.toString("hex");
            User.findByIdAndUpdate(
              { _id: user._id },
              {
                reset_password_token: token,
                reset_password_expires: Date.now() + 86400000,
              },
              { upsert: true, new: true }
            ).exec(function (err, new_user) {
              if (err) console.log(err);
              send(err, token);
            });
          });
          const send = (err, token) => {
            const mailOptions = {
              from: process.env.MAIL, // sender address
              to: user.email, // receiver
              subject: "Reset your password?", // Subject line
              html: `<p>if you requested a password reset for <b>@${user.username}</b>, click the button below. If you didn't make this request, ignore this email.</p>
              <a href="http://localhost:3000/auth/reset_password?token=${token}">Click here to reset password</>
              `, // plain text body
            };
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) console.log(err);
              else {
                if (info.accepted.length > 0) {
                  res.json({ status: true });
                } else {
                  res.json({ status: false });
                }
              }
            });
          };
        }
      });
  }
};
exports.reset_password = function (req, res) {
  const { password, confirm_password, token } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    User.findOne({
      reset_password_token: token,
      reset_password_expires: {
        $gt: Date.now(),
      },
    }).exec(function (err, user) {
      if (!err && user) {
        if (password === confirm_password) {
          user.password = password;
          user.reset_password_token = null;
          user.reset_password_expires = null;
          user.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              jwt.sign(
                { id: user._id },
                process.env.JWTSECRET,
                {
                  expiresIn: 36000, // 10 hours
                },
                (err, token) => {
                  if (err) throw err;
                  res.json({ status: true, token });
                  console.log(
                    "user logged in " + user.username + " " + new Date()
                  );
                }
              );
            }
          });
        } else {
          return res.status(200).json({
            errors: [
              { param: "confirm_password", msg: "Passwords do not match" },
            ],
          });
        }
      } else {
        return res.status(200).json({
          errors: [
            {
              param: "token",
              msg: "Password reset token is invalid or has expired.",
            },
          ],
        });
      }
    });
  }
};
