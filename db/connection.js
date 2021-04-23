const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const db = mongoose.connection
require("dotenv").config()
const URI = process.env.DBURL

const connectDB = async () => {
  await mongoose
    .connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database Connected")
    })
    .catch((err) => console.log(err))

  const Schema = mongoose.Schema
  const UserDetail = new Schema({
    email: String,
    password: String,
  })

  UserDetail.plugin(passportLocalMongoose)
  const UserDetails = mongoose.model("userInfo", UserDetail, "userInfo")
}

module.exports = connectDB
