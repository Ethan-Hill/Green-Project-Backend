const express = require("express")
const router = express.Router()
const User = require("../models/User")
const jwt = require("jsonwebtoken")

router.post("/", async (req, res) => {
  const { token } = req.body
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.send(decoded)
  } catch (err) {
    res.sendStatus(401)
  }
})

module.exports = router
