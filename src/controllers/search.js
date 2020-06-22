const User = require("../models/user");
const Project = require("../models/project");
const { validationResult } = require("express-validator");

exports.user = (req, res) => {
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
    { sort: "followers", limit: 80 },
    (err, user) => {
      res.json({ status: true, user });
    }
  );
};
exports.project = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array(), status: false });
  }
  var query = {};
  const { search } = req.body;
  if (search) {
    query = {
      status: true,
      $or: [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          content: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ],
    };
  }
  Project.find(
    query,
    "-__v",
    { sort: "created", limit: 80 },
    (err, project) => {
      res.json({ status: true, project });
    }
  );
};
