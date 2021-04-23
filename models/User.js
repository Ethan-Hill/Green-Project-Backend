var mongoose = require("mongoose")

var UserSchema = new mongoose.Schema({
  email: String,
  code: String,
})

module.exports = mongoose.model("User", UserSchema)
