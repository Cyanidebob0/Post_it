const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/27017/Mongo_login");

const userSchema = mongoose.Schema({
  userName: String,
  password: String,
});

module.exports = mongoose.model("user", userSchema);
