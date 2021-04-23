const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authCode } = require("../utils")

const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")

const auth = {
  auth: {
    api_key: "927772e4f6ba01768c527312c88a00d6-1df6ec32-59e122d0",
    domain: "sandboxa1121975b91d41a0873268a7544d1052.mailgun.org",
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
        html: `<h1>Hey there</h1><h2>Looks like you need a code to verify.</h2><h3>Here it is <b>${code}</b></h3>`,
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
