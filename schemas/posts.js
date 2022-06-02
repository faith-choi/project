const mongoose = require("mongoose");

const postsSchema = mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  date: {
    format: Date(),
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
