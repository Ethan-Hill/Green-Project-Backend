const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authCode } = require("../utils")
require("dotenv").config()
const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")
var htmlToText = require("nodemailer-html-to-text").htmlToText

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
    nodemailerMailgun.use("compile", htmlToText())
    nodemailerMailgun.sendMail(
      {
        from: "verify@ethanhill.dev",
        to: data.email, // An array if you have multiple recipients.,
        subject: "Verification code",
        //You can use "html:" to send HTML email content. It's magic!
        html: `<!DOCTYPE html> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta name="x-apple-disable-message-reformatting" /> <style> a { color: #0000ee; text-decoration: underline; } @media only screen and (min-width: 620px) { .u-row { width: 600px !important; } .u-row .u-col { vertical-align: top; } .u-row .u-col-50 { width: 300px !important; } .u-row .u-col-100 { width: 600px !important; } } @media (max-width: 620px) { .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; } .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; } .u-row { width: calc(100% - 40px) !important; } .u-col { width: 100% !important; } .u-col > div { margin: 0 auto; } } body { margin: 0; padding: 0; } table, tr, td { vertical-align: top; border-collapse: collapse; } p { margin: 0; } .ie-container table, * { line-height: inherit; } a[x-apple-data-detectors="true"] { color: inherit !important; text-decoration: none !important; } </style> <link rel="preconnect" href="https://fonts.gstatic.com" /> <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet" /> </head> <body class="clean-body" style=" margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f0f0f0; " > <table style=" border-collapse: collapse; table-layout: fixed; border-spacing: 0; vertical-align: top; min-width: 320px; margin: 0 auto; background-color: #f0f0f0; width: 100%; " cellpadding="0" cellspacing="0" > <tbody> <tr style="vertical-align: top;"> <td style=" word-break: break-word; border-collapse: collapse !important; vertical-align: top; " > <div class="u-row-container" style="padding: 0px 10px; background-color: #fff;" > <div class="u-row" style=" margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #fff; " > <div style=" border-collapse: collapse; display: table; width: 100%; background-color: transparent; " > <div class="u-col u-col-100" style=" max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top; " > <div style="width: 100% !important;"> <table style="font-family: 'Montserrat', sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" overflow-wrap: break-word; word-break: break-word; padding: 20px 20px 30px 20px; font-family: 'Montserrat', sans-serif; " align="left" > <table width="100%" cellpadding="0" cellspacing="0" > <tr> <td style=" padding-right: 0px; padding-left: 0px; " align="left" > <img style="max-width: 200px;" src="https://green.cdn.energy/branding/logo-r.svg" alt="logo" /> </td> </tr> </table> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> <div class="u-row-container" style="padding: 0px 10px 1px; background-color: #fff;" > <div class="u-row" style=" margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #fff; " > <div style=" border-collapse: collapse; display: table; width: 100%; background-color: transparent; " > <div class="u-col u-col-100" style=" max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top; " > <div style="width: 100% !important;"> <table style="font-family: 'Montserrat', sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" overflow-wrap: break-word; word-break: break-word; padding: 10px 20px; font-family: 'Montserrat', sans-serif; " align="left" > <div style=" color: #333d42; text-align: left; word-wrap: break-word; " > <p> <span style="font-size: 24px; line-height: 29px;" > <strong>Verify your email</strong> </span> </p> </div> </td> </tr> </tbody> </table> <table style="font-family: 'Montserrat', sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" overflow-wrap: break-word; word-break: break-word; padding: 10px 20px 20px; font-family: 'Montserrat', sans-serif; " align="left" > <div style=" color: #333d42; text-align: left; word-wrap: break-word; " > <p style=" font-size: 16px; line-height: 24px; font-weight: 100; " > Use this code to verify your email. </p> </div> </td> </tr> </tbody> </table> <table style="font-family: 'Montserrat', sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" > <tbody> <tr> <td style=" overflow-wrap: break-word; word-break: break-word; padding: 20px; font-family: 'Montserrat', sans-serif; " align="left" > <div style=" color: #333d42; text-align: left; word-wrap: break-word; " > <p> <span style="font-size: 24px; line-height: 29px;" > <strong>${code}</strong> </span> </p> </div> <div style=" color: #333d42; text-align: left; word-wrap: break-word; " > <p style=" margin-top: 20px; font-size: 16px; line-height: 24px; font-weight: 100; " > If you have any issues please contact <a href="mailto:support@green.energy">Green</a >.<br /> </p> </div> </td> </tr> </tbody> </table> </div> </div> </div> </div> </div> </td> </tr> </tbody> </table> </body> </html>
		`,
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
