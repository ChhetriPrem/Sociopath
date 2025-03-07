const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const generateToken = require("../utils/jwt");

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password, img, location, bio } = req.body;

  try {
    // Checking if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Registering new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      img,
      bio,
      location,
    });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User successfully registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "User is not registered. Please register first!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }

    const token = generateToken(existingUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // change to `true` in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clears the token cookie
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
