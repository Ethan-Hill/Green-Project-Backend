const express = require("express")
const router = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")

router.post("/", async (req, res) => {
  const { email, code, remember } = req.body

  const user = await User.findOne({
    email,
  })

  if (!user) {
    res.status(409).json({
      message: "Email was not found",
    })
  } else if (user.code !== code) {
    res.status(401).json({
      message: "Code was wrong, please try again.",
    })
  } else if (user.code === code && remember) {
    await User.findOneAndUpdate({ email: email }, { $set: { code: "" } })
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { email, id: user._id },
      },
      process.env.JWT_SECRET
    )
    res.send({
      message: "User Verified",
      isVerified: true,
      email,
      id: user._id,
      token,
    })
  } else {
    await User.findOneAndUpdate({ email: email }, { $set: { code: "" } })
    res.send({
      message: "User Verified",
      isVerified: true,
      email,
      id: user._id,
    })
  }
})

module.exports = router
