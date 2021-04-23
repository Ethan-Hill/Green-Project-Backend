const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authCode } = require("../utils")
require("dotenv").config()
const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")

const auth = {
  auth: {
    api_key: process.env.api_key,
    domain: process.env.domain,
  },
}

const nodemailerMailgun = nodemailer.createTransport(mg(auth))

router.post("/", async (req, res) => {
  const data = req.body
  console.log(data)

  const user = await User.findOne({
    email: data.email,
  })

  if (!user) {
    res.status(409).json({
      message: "Email was not found",
    })
  } else {
    const code = authCode()

    await User.findOneAndUpdate({ email: data.email }, { $set: { code: code } })
    const mail = await nodemailerMailgun
      .sendMail({
        from: "verify@ethanhill.dev",
        to: data.email, // An array if you have multiple recipients.,
        subject: "Verification code",
        template: "verify",
        "h:X-Mailgun-Variables": JSON.stringify({ code }),
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(mail)

    res.send(user)
  }
})

module.exports = router
