const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.find = function(req, res) {
  const errors = validationResult(req);
  const { username } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  User.find({ username })
    .select(["-password", "-email", "-email_verified_at"])
    .then(user => {
      if (Array.isArray(user) && user.length)
        res.json({ user: user[0], status: true });
      else res.json({ status: false, msg: "user not found" });
    })
    .catch(err => res.json({ err }));
};
exports.follow = function(req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  res.json({ status: true, id });
};
