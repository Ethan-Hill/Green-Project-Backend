const mongoose = require("mongoose")
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
}

module.exports = connectDB
