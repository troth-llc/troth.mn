const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Document = require("../models/document");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const key = require("../../config.json");
const { bucket } = require("../middleware/multer");
const crypto = require("crypto");
const hash = () => {
  return crypto
    .createHash("sha1")
    .update(Math.random().toString() + new Date().valueOf().toString())
    .digest("hex");
};
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
// file
var path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const upload_path =
  path.dirname(require.main.filename) + "/client/public/uploads/";
exports.info = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const { name, username, website, gender, about, phone } = req.body;
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    if (user) {
      User.findById(user.id).then((data) => {
        User.findOne({ username: new RegExp(`^${username}$`, "i") }).then(
          (user) => {
            if (user === null || user.username === data.username) {
              data.name = name;
              data.username = username.toLowerCase();
              data.website = website;
              data.gender = gender;
              data.about = about;
              data.phone = phone;
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
exports.avatar = function (req, res) {
  var { file } = req;
  if (!file)
    return res.json({
      status: false,
      errors: [{ msg: "No file uploaded.", param: file }],
    });
  else {
    const blob = bucket.file(
      "avatar/" +
        hash() +
        "." +
        req.file.originalname.split(".").pop().toLowerCase()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      const avatar = `http://cdn.troth.mn/${blob.name}`;
      User.findById(req.user.id, (err, user) => {
        user.avatar = avatar;
        user.save((err) => {
          return res.json({ status: true });
        });
      });
    });
    blobStream.end(req.file.buffer);
  }
};
exports.email = function (req, res) {
  const { email, password } = req.body;
  const token = req.header("x-auth-token");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  User.find({ email: email.toLowerCase() }).then((user) => {
    if (user.length > 0)
      return res.json({
        errors: [{ msg: "Email already in use", param: "email" }],
      });
    else
      jwt.verify(token, process.env.JWTSECRET, function (err, user) {
        User.findById(user.id).then((data) => {
          bcrypt.compare(password, data.password).then((isMatch) => {
            if (!isMatch)
              return res.json({
                errors: [{ msg: "Password does not match", param: "password" }],
              });
            else {
              var code = Math.floor(100000 + Math.random() * 900000);
              data.email_update = [{ email, code }];
              data.save();
              send(
                email,
                "Update Email",
                `<p>Your verification code is <b>${code}</b>. If you didn't make this request, ignore this email.</p>`
              ).then((status) => res.json({ status }));
            }
          });
        });
      });
  });
};
exports.code = function (req, res) {
  const token = req.header("x-auth-token");
  const { code } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    User.findById(user.id).then((data) => {
      if (data.email_update[0].code === parseInt(code)) {
        data.email = data.email_update[0].email;
        data.email_verified_at = new Date();
        data.email_token = null;
        data.email_update = [];
        data.save();
        res.json({ status: true });
      } else {
        res.json({ status: false, errors: [{ msg: "Invalid code" }] });
      }
    });
  });
};
exports.verify = function (req, res) {
  const token = req.header("x-auth-token");
  const front = req.files.front[0].filename;
  const back = req.files.back[0].filename;
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    User.findById(user.id).then((data) => {
      Document.find({ user: data._id }).then((user) => {
        if (user.length > 0)
          return res.json({ status: false, msg: "Your request is pending" });
        else {
          Document.create(
            { user: data._id, files: [{ front, back }] },
            (err, doc) => {
              if (err) console.log(err);
              data.verification_status = "pending";
              data.save();
              transporter.sendMail(
                {
                  from: process.env.MAIL,
                  to: data.email,
                  subject: "Documents Uploaded Successfully",
                  html: `<b>Dear ${data.name}</b><br />
                  <p>We would like to inform you that your documents have been uploaded successfully and will be evaluated by the relevant department within 24 business hours.</p>`,
                },
                (err, info) => {
                  if (err) console.log(err);
                  res.json({
                    status: info.accepted.length > 0 ? true : false,
                  });
                }
              );
            }
          );
        }
      });
    });
  });
};
