const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Post owner

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Commenter
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users who liked

  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
