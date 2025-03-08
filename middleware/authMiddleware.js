// Load environment variables

const jwt = require("jsonwebtoken");

const jwtSecret = "renao"; // JWT secret from env variables

const authMiddleware = (req, res, next) => {
  // Look for token in cookies or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  console.log("Received token:", token); // Debugging: check if token is being received

  if (!token) {
    console.log("No token provided"); // Debugging
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded token:", decoded); // Debugging: Log decoded user data

    // Attach the decoded user information to the request object
    req.user = decoded;
    next(); // Pass control to the next middleware/route
  } catch (error) {
    console.error("Token verification error:", error); // Debugging

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  }
};

module.exports = authMiddleware;
