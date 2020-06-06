const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const project_categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
const project_category = mongoose.model(
  "project_category",
  project_categorySchema
);
module.exports = project_category;
