const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
exports.find = function(req, res) {
  const errors = validationResult(req);
  const { username } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  User.findOne({ username })
    .then(user => {
      if (user) {
        var current;
        const token = req.header("x-auth-token");
        jwt.verify(token, process.env.JWTSECRET, (err, data) => {
          if (data) current = data.id;
          else current = "";
        });
        var following = false;
        user.followers.map(data => {
          if (data.user == current) following = true;
          else following = false;
        });
        res.json({
          user: {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            verified: user.verified,
            type: user.type,
            badges: user.badges,
            projects: user.projects,
            name: user.name,
            gender: user.gender,
            following: user.following.length,
            followers: user.followers.length
          },
          following,
          status: true
        });
      } else res.json({ status: false, msg: "user not found" });
    })
    .catch(err => {
      console.log(err);
      res.json({ err });
    });
};
exports.follow = function(req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function(err, data) {
    if (err) {
      res.json({ status: false, err });
    }
    if (data.id === id) {
      return res.json({ status: false, msg: "You cannot follow yourself" });
    }
    User.findById(id).then(user => {
      // check if the requested user is already in follower list of other user then
      if (
        user.followers.filter(follower => follower.user.toString() === data.id)
          .length > 0
      ) {
        return res.json({ msg: "You already followed the user" });
      }
      user.followers.unshift({ user: data.id });
      user.save();
      User.findById(data.id)
        .then(user => {
          user.following.unshift({ user: id });
          user.save().then(user => res.json({ status: true }));
        })
        .catch(err => res.json({ status: false }));
    });
  });
};
exports.unfollow = function(req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function(err, data) {
    if (err) {
      res.json({ status: false, err });
    }
    if (data.id === id) {
      return res.json({ status: false, msg: "You cannot unfollow yourself" });
    }
    User.findByIdAndUpdate(
      id,
      { $pull: { followers: { user: data.id } } },
      (err, result) => {
        if (result) {
          User.findByIdAndUpdate(
            data.id,
            { $pull: { following: { user: result._id } } },
            (err, done) => {
              if (done) res.json({ status: true });
            }
          );
        }
      }
    );
  });
};
