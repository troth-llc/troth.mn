const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  status: { type: String },
  amount: { type: Number, required: true },
  date: { type: Date },
  payment_id: { type: String },
  transaction_id: { type: String },
  description: { type: String, default: null },
  bill_id: { type: String },
});
const invoice = mongoose.model("invoice", invoiceSchema);
module.exports = invoice;
