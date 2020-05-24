const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const key = require("../../config.json");
// email config
const send = async (to, subject, html) => {
  return new Promise(async (resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.MAIL,
        serviceClient: key.client_id,
        privateKey: key.private_key,
      },
    });
    try {
      await transporter.verify();
      var result = await transporter.sendMail({
        from: `TROTH LLC ${process.env.MAIL}`,
        to,
        subject,
        html,
      });
      if (result.accepted.length > 0) {
        resolve(true);
      }
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
};
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
                        return res.json({ status: true, token });
                      }
                    );
                    send(
                      user.email,
                      "Verify Your Email Address",
                      `<p>Dear <b>${user.name}</b> <br/> This message has been sent to you because you entered your email on a registration form, 
                  click the button below to verify your email. If you didn't make this request, ignore this email.</p>
                  <a href="https://troth.mn/auth/email/${token}">Click here to verify your email</>`
                    );
                  }
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
      { email: email.trim().toLowerCase() },
      { username: new RegExp(`^${email.trim()}$`, "i") },
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
  User.findById(req.user.id)
    .select(
      "-password -reset_password_expires -reset_password_token -reset_password_token -email_token -__v"
    )
    .populate({ path: "following", select: "user" })
    .populate({ path: "followers", select: "user" })
    .exec((err, user) => {
      if (err) res.json({ msg: "some thing went wrong" });
      else if (user === null)
        res.json({ msg: "token expired or user not found" });
      else {
        var result = { ...user._doc };
        result.followers = result.followers.length;
        result.following = result.following.length;
        res.json({
          user: result,
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
              send(
                new_user.email,
                "Reset your password?",
                `<p>if you requested a password reset for <b>@${new_user.username}</b>, click the button below. If you didn't make this request, ignore this email.</p>
              <a href="https://troth.mn/auth/password/${token}">Click here to reset password</>`
              ).then((result) => {
                if (!result) res.json({ status: false });
                else res.json({ status: true });
              });
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
          send(
            user.email,
            "Verify Your Email Address",
            `<p>Dear <b>${user.name}</b> <br/> 
          Click the button below to verify your email. If you didn't make this request, ignore this email.</p>
          <a href="https://troth.mn/auth/email/${
            user.email_token ? user.email_token : token
          }">Click here to verify your email</>`
          ).then((result) => {
            if (!result) console.log("email sending failed");
            else
              res.json({
                status: true,
              });
          });
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
