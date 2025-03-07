const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");

const jwtSecret = "renao";
const User = require("../models/User");

router.post("/profile", async (req, res) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login, token expired or not set" });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);


    // Find user in database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

   

    // Send user data
    return res.json({
      username: user.username,
      email: user.email,
      img: user.img, // Assuming `image` field exists
      location: user.location, // Assuming `image` field exists
      bio: user.bio, // Assuming `image` field exists
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;
