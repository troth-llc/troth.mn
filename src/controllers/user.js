const { validationResult } = require("express-validator");
const User = require("../models/user");
const Notification = require("../models/follow_notification");
const jwt = require("jsonwebtoken");
exports.find = function (req, res) {
  const errors = validationResult(req);
  const { username } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  User.findOne({ username })
    .select(
      "username avatar verified type badges projects name following followers about website"
    )
    .then((user) => {
      if (user) {
        var current;
        const token = req.header("x-auth-token");
        jwt.verify(token, process.env.JWTSECRET, (err, data) => {
          if (data) current = data.id;
          else current = "";
        });
        var following = user.followers.some((data) => {
          if (data.toString() === current) return true;
          else return false;
        });
        var result = { ...user._doc };
        result.followers = result.followers.length;
        result.following = result.following.length;
        res.json({
          user: result,
          following,
          status: true,
        });
      } else res.json({ status: false, msg: "user not found" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: false });
    });
};
exports.follow = function (req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  var data = req.user;
  if (data.id === id) {
    return res.json({ status: false, msg: "You cannot follow yourself" });
  }
  User.findById(id)
    .select("followers following notifications")
    .populate({
      path: "notifications",
    })
    .exec((error, user) => {
      if (
        user.followers.filter((follower) => follower.toString() === data.id)
          .length > 0
      ) {
        return res.json({ msg: "You already followed the user" });
      }
      if (
        (filter_followed_user =
          user.notifications.filter(
            (follow_notifications) =>
              follow_notifications.user.toString() === data.id
          ).length > 0)
      ) {
        user.followers.unshift(data.id);
        user.save();
      } else {
        Notification.create({ user: data.id }).then((notification) => {
          user.followers.unshift(data.id);
          user.notifications.unshift(notification._id);
          user.save();
        });
      }
      User.findById(data.id)
        .then((user) => {
          user.following.unshift(id);
          user.save().then(() => res.json({ status: true }));
        })
        .catch((err) => res.json({ status: false }));
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
      { $pull: { followers: data.id } },
      (err, result) => {
        if (result) {
          User.findByIdAndUpdate(
            data.id,
            { $pull: { following: result._id } },
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
