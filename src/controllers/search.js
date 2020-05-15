const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.user = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  var query = {};
  const { search } = req.body;
  if (search) {
    query = {
      $or: [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          username: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ],
    };
  }
  User.find(
    query,
    "name username avatar verified type",
    { sort: "followers" },
    (err, user) => {
      res.json({ status: true, user });
    }
  );
};
