const mongoose = require("mongoose");
/* const AutoIncrement = require("mongoose-sequence")(mongoose); */

const postsSchema = mongoose.Schema({
  postId: {
    type: Number,
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

/* postsSchema.plugin(AutoIncrement, {
  id: "post_seq",
  inc_field: "postId",
}); */
module.exports = mongoose.model("Posts", postsSchema);
