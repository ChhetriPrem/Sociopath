const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  img: String,
  bio: String,
  location: String,
});

module.exports = mongoose.model("User", userSchema);
