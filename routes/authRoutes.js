const express = require("express");

const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const generateToken = require("../utils/jwt");

// define the signup page

router.post("/signup", async (req, res) => {
  const { username, email, password, img, location, bio } = req.body;

  try {
    // checking if user aleady exist
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    // encryping with salt and hashed password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // if not then resgister use
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
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ message: "User successfully registered in the database" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// let make the login system
// todo 1. see if user exists , if yes match the email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // check the username exist
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message:
          "User is not registered in the database, Please register first!",
      });
    }

    // if user exist check the password and email
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }

    // save the token when logiin also
    const token = generateToken(existingUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch {}
});

module.exports = router;

// todo: to make logout functionality
