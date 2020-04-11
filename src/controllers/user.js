const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const async = require("async");
exports.find = function (req, res) {
  const errors = validationResult(req);
  const { username } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        var current;
        const token = req.header("x-auth-token");
        jwt.verify(token, process.env.JWTSECRET, (err, data) => {
          if (data) current = data.id;
          else current = "";
        });
        var following = user.followers.some((data) => {
          if (data.user.toString() === current) return true;
          else return false;
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
            followers: user.followers.length,
          },
          following,
          status: true,
        });
      } else res.json({ status: false, msg: "user not found" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ err });
    });
};
exports.follow = function (req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, data) {
    if (err) {
      res.json({ status: false, err });
    }
    if (data.id === id) {
      return res.json({ status: false, msg: "You cannot follow yourself" });
    }
    User.findById(id).then((user) => {
      // check if the requested user is already in follower list of other user then
      if (
        user.followers.filter(
          (follower) => follower.user.toString() === data.id
        ).length > 0
      ) {
        return res.json({ msg: "You already followed the user" });
      }
      user.followers.unshift({ user: data.id });
      user.save();
      User.findById(data.id)
        .then((user) => {
          user.following.unshift({ user: id });
          user.save().then((user) => res.json({ status: true }));
        })
        .catch((err) => res.json({ status: false }));
    });
  });
};
exports.unfollow = function (req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, data) {
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
exports.followers = (req, res) => {
  const { id } = req.params;
  const { start, end } = req.query;
  if (parseInt(end) - parseInt(start) > 100) {
    return res.json({ status: false, msg: "too many requests" });
  }
  // const token = req.header("x-auth-token");
  // var data = false;
  // if (token) {
  //   jwt.verify(token, process.env.JWTSECRET, function(err, user) {
  //     if (user) data = user.id;
  //     else data = false;
  //   });
  // }
  User.findOne(
    { _id: id },
    { followers: { $slice: [parseInt(start), parseInt(end)] } }
  )
    .select("-following")
    .then((user) => {
      let promises = user.followers.map((results) => {
        return User.findOne({ _id: results.user })
          .select("name username avatar verified")
          .exec()
          .then((res) => {
            return res;
          });
      });
      Promise.all(promises).then((follow) => {
        if (follow.length > 0) {
          res.json({
            status: true,
            last: false,
            start,
            end,
            follow,
          });
        } else res.json({ status: false, last: true });
      });
    });
};
exports.following = (req, res) => {
  const { id } = req.params;
  const { start, end } = req.query;
  if (parseInt(end) - parseInt(start) > 100) {
    return res.json({ status: false, msg: "too many requests" });
  }
  // const token = req.header("x-auth-token");
  // var data = false;
  // if (token) {
  //   jwt.verify(token, process.env.JWTSECRET, function(err, user) {
  //     if (user) data = user.id;
  //     else data = false;
  //   });
  // }
  User.findOne(
    { _id: id },
    { following: { $slice: [parseInt(start), parseInt(end)] } }
  )
    .select("-followers")
    .then((user) => {
      let promises = user.following.map((results) => {
        return User.findOne({ _id: results.user })
          .select("name username avatar verified")
          .exec()
          .then((res) => {
            return res;
          });
      });
      Promise.all(promises).then((follow) => {
        if (follow.length > 0) {
          res.json({
            status: true,
            last: false,
            start,
            end,
            follow,
          });
        } else res.json({ status: false, last: true });
      });
    });
};
