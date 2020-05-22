const Category = require("../models/project_category");
exports.category = (req, res) => {
  Category.find().then((result) => res.json({ result }));
};
exports.create = (req, res) => {
  return res.json({ status: true });
};
exports.media = (req, res) => {
  return res.json({ status: true });
};
