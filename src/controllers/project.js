const Category = require("../models/project_category");
exports.category = (req, res) => {
  Category.find().then((result) => res.json({ result }));
};
