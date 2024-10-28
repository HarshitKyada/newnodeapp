const express = require("express");
const Auth = require("../../models/Auth");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const existingUser = await Auth.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "You are not a registered user register first.",
      });
    }

    // Use bcrypt.compare to check the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    existingUser.token = crypto.randomBytes(64).toString("hex");
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: existingUser.token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
