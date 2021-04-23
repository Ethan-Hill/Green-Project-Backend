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
    nodemailerMailgun.sendMail(
      {
        from: "verify@ethanhill.dev",
        to: data.email, // An array if you have multiple recipients.,
        subject: "Verification code",
        //You can use "html:" to send HTML email content. It's magic!
        html: `<img style="max-width: 200px;" src="https://green.cdn.energy/branding/logo-r.svg" alt="logo" /> <p> <span style="font-size: 24px; line-height: 29px;"> <strong>Verify your email</strong> </span> </p> <div style="color: #333d42; text-align: left; word-wrap: break-word;"> <p style="font-size: 16px; line-height: 24px; font-weight: 100;"> Use this code to verify your email. </p> </div> <div style="color: #333d42; text-align: left; word-wrap: break-word;"> <p> <span style="font-size: 24px; line-height: 29px;"> <strong>${code}</strong> </span> </p> </div>`,
        //You can use "text:" to send plain-text content. It's oldschool!
        text: "Mailgun rocks, pow pow!",
      },
      (err, info) => {
        if (err) {
          console.log(`Error: ${err}`)
        } else {
          console.log(`Email sent to ${data.email}`)
        }
      }
    )

    res.send(user)
  }
})

module.exports = router
