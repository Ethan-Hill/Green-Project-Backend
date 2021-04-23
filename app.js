require("dotenv").config()

const mongoose = require("mongoose")
const URI = process.env.DBURL
const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
})

const port = process.env.PORT

const indexRouter = require("./routes/index")
const loginRouter = require("./routes/login")
const verifyRouter = require("./routes/verify")
const usersRouter = require("./routes/users")
const authRouter = require("./routes/auth")

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession)

app.use("/", indexRouter)
app.use("/login", loginRouter)
app.use("/users", usersRouter)
app.use("/verify", verifyRouter)
app.use("/auth", authRouter)

// Establish connection to the MongoDB database, established in connection.js
mongoose
  .connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database Connected")
  })
  .catch((err) => console.log(err))

// API server bootup
app.listen(port, () => {
  console.clear()
  console.log(`Server listening on port ${port}`)
})
