const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    default: null,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: "member"
  },
  badges: {
    type: Array,
    default: []
  },
  following: [
    {
      user: {
        type: Schema.ObjectId,
        ref: "User"
      },
      date: { type: Date, default: new Date() }
    }
  ],
  followers: [
    {
      user: {
        type: Schema.ObjectId,
        ref: "User"
      },
      date: { type: Date, default: new Date() }
    }
  ],
  projects: {
    type: Array,
    default: []
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  email_verified_at: {
    type: Date,
    default: null
  },
  password_updated_at: {
    type: Date,
    default: new Date()
  }
});
// hash user password before saving into database
userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
const user = mongoose.model("user", userSchema);
module.exports = user;
