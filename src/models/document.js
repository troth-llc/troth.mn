const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  files: [
    {
      front: {
        type: String,
      },
      back: {
        type: String,
      },
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  created: {
    type: Date,
    default: new Date(),
  },
});
const document = mongoose.model("document", documentSchema);
module.exports = document;
