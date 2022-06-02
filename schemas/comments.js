const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  postId: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  date: {
    format: Date(),
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
