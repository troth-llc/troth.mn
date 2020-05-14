const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// email config
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
    type: "login",
  },
});
exports.create = function (req, res) {
  const errors = validationResult(req);
  const { name, username, email, password } = req.body;
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
              email,
              password,
            },
            (err, user) => {
              if (err) throw err;
              crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString("hex");
                User.findByIdAndUpdate(
                  { _id: user._id },
                  {
                    email_token: token,
                  },
                  { upsert: true, new: true }
                ).exec(async (err, user) => {
                  if (err) console.log(err);
                  transporter.sendMail(
                    {
                      from: `Troth LLC ${process.env.MAIL}`,
                      to: user.email,
                      subject: "Verify Your Email Address",
                      html: `<p>Dear <b>${user.name}</b> <br/> This message has been sent to you because you entered your email on a registration form, 
                      click the button below to verify your email. If you didn't make this request, ignore this email.</p>
                      <a href="http://localhost:3000/auth/verify_email?token=${token}">Click here to verify your email</>`,
                    },
                    (err, info) => {
                      if (err) return res.json({ status: false });
                      else {
                        jwt.sign(
                          { id: user._id },
                          process.env.JWTSECRET,
                          {
                            expiresIn: 36000, // 10 hours
                          },
                          (err, token) => {
                            if (err) throw err;
                            res.json({ status: true, token });
                          }
                        );
                      }
                    }
                  );
                });
              });
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
    if (!user) res.json({ msg: "some thing went wrong" });
    else {
      User.findById(user.id)
        .select("-password")
        .then((user) => {
          if (!user) res.json({ msg: "some thing went wrong" });
          else {
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
                website: user.website,
                about: user.about,
                created: user.created,
                updated: user.updated,
                phone: user.phone,
                password_updated: user.password_updated,
                following: user.following.length,
                followers: user.followers.length,
                verification_status: user.verification_status,
              },
            });
          }
        });
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
          crypto.randomBytes(20, function (err, buffer) {
            var token = buffer.toString("hex");
            User.findByIdAndUpdate(
              { _id: user._id },
              {
                reset_password_token: token,
                reset_password_expires: Date.now() + 86400000,
              },
              { upsert: true, new: true }
            ).exec(async (err, new_user) => {
              if (err) console.log(err);
              transporter.sendMail(
                {
                  from: process.env.MAIL,
                  to: new_user.email,
                  subject: "Reset your password?",
                  html: `<p>if you requested a password reset for <b>@${new_user.username}</b>, click the button below. If you didn't make this request, ignore this email.</p>
                <a href="http://localhost:3000/auth/reset_password?token=${token}">Click here to reset password</>`,
                },
                (err, info) => {
                  if (err) console.log(err);
                  res.json({ status: info.accepted.length > 0 ? true : false });
                }
              );
            });
          });
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
          user.password_updated = new Date();
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
              { param: "confirm_password", msg: "Passwords does not match" },
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
exports.email = function (req, res) {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    if (user) {
      User.findById(user.id).then((user) => {
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString("hex");
          transporter.sendMail(
            {
              from: `Troth LLC ${process.env.MAIL}`,
              to: user.email,
              subject: "Verify Your Email Address",
              html: `<p>Dear <b>${user.name}</b> <br/> 
              Click the button below to verify your email. If you didn't make this request, ignore this email.</p>
              <a href="http://localhost:3000/auth/verify_email?token=${
                user.email_token ? user.email_token : token
              }">Click here to verify your email</>`,
            },
            (err, info) => {
              if (err) console.log(err);
              res.json({
                status: info.accepted.length > 0 ? true : false,
              });
            }
          );
          if (!user.email_token) {
            user.email_token = token;
            user.save();
          }
        });
      });
    } else {
      res.json({ status: false });
    }
  });
};
exports.verify_email = function (req, res) {
  const { token: email_token } = req.body;
  User.findOne({ email_token }).then((user) => {
    if (!user) res.json({ status: false });
    else {
      user.email_token = null;
      user.email_verified_at = new Date();
      user.email_update = [];
      user.save();
      res.json({ status: true });
    }
  });
};
