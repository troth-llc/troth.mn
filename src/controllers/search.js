const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.find = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  var query = {};
  if (req.query.q) {
    query = {
      $or: [
        {
          name: {
            $regex: req.query.q.trim(),
            $options: "i",
          },
        },
        {
          username: {
            $regex: req.query.q.trim(),
            $options: "i",
          },
        },
      ],
    };
  }
  User.find(query, "name username avatar", (err, user) => {
    res.json({ status: true, user });
  });
};
