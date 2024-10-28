const express = require("express");
const Auth = require("../../models/Auth");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "You are already an active user.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAuth = new Auth({
      username,
      email,
      password: hashedPassword,
    });

    await newAuth.save();

    res.status(201).json({
      success: true,
      message: "You have signed up successfully.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
