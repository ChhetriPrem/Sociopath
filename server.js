const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoute = require("./routes/uploadRoute");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const path = require("path");
const cors = require("cors");

app.use(cookieParser());

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://renao:renaopassword@cluster0.kak04.mongodb.net/userDb"
  )
  .then(() => {
    console.log("Database connected successfully");
  });

app.use(
  cors({
    origin: [
      "https://frontend-sastagram.vercel.app",
      "https://sociopath-git-main-chhetriprems-projects.vercel.app",
      "https://frontend-sastagram-6f7ar7z2k-chhetriprems-projects.vercel.app",
    ],
    credentials: true, // Allow cookies
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow token header
  })
);



app.use("/auth", authRouter);
app.use("/user", postRoutes);
app.use("/user", uploadRoute);
app.use("/user", profileRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/page/user.html"));
});

app.get("/auth/check", authMiddleware, (req, res) => {
  return res.json({ authenticated: true, user: req.user });
});

app.listen(3000, () => {
  console.log("Server initialized successfully");
});
