require('dotenv').config(); // Load environment variables

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "default-secret"; // JWT secret from env variables

const authMiddleware = (req, res, next) => {
  // Look for token in cookies or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  console.log(token); // Debugging: check if token is being received

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Store user info in req.user
    console.log(decoded); // Debugging: Log decoded user data
    next(); // Pass control to the next middleware/route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  }
};

module.exports = authMiddleware;
