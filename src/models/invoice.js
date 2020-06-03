const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  created_by: { type: Schema.Types.ObjectId, ref: "user" },
  amount: {
    type: Number,
    required: true,
  },
  description: { type: String, default: null },
  bill_id: { type: String },
  trace_no: { type: String },
  status: { type: String, default: "pending" },
});
const invoice = mongoose.model("invoice", invoiceSchema);
module.exports = invoice;
