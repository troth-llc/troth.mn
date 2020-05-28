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
  video: {
    type: String,
    default: null,
  },
  nonprofit: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  category: { type: Schema.Types.ObjectId, ref: "project_category" },
  owner: { type: Schema.Types.ObjectId, ref: "user" },
  content: {
    type: String,
    required: true,
  },
  funded: {
    type: Number,
    default: 0,
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
