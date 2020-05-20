const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    default: null,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verification_status: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: "member",
  },
  badges: {
    type: Array,
    default: [],
  },
  following: [{ type: Schema.Types.ObjectId, ref: "user" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
  projects: [{ type: Schema.Types.ObjectId, ref: "project" }],
  submissions: [{ type: Schema.Types.ObjectId, ref: "submission" }],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "follow_notification",
    },
  ],
  created: {
    type: Date,
    default: new Date(),
  },
  about: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  email_token: {
    type: String,
    default: null,
  },
  email_update: [
    {
      email: {
        type: String,
        default: null,
      },
      code: {
        type: Number,
        default: null,
      },
    },
  ],
  email_verified_at: {
    type: Date,
    default: null,
  },
  password_updated: {
    type: Date,
    default: new Date(),
  },
  updated: {
    type: Date,
    default: new Date(),
  },
  reset_password_token: {
    type: String,
    default: null,
  },
  reset_password_expires: {
    type: Date,
    default: null,
  },
});
// hash user password before saving into database
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
const user = mongoose.model("user", userSchema);
module.exports = user;
