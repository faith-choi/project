const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    reqruied: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", userSchema);
