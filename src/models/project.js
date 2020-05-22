const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  nonprofit: {
    type: Boolean,
    default: false,
  },
  category: { type: Schema.Types.ObjectId, ref: "project_category" },
  owner: { type: Schema.Types.ObjectId, ref: "user" },
  content: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    default: new Date(),
  },
  created: {
    type: Date,
    default: new Date(),
  },
});
const project = mongoose.model("project", projectSchema);
module.exports = project;
