const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import middleware
const cors = require("cors");

// ✅ 1. Create a Post
router.post("/createPost", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id);
    const { title, img } = req.body;
    
    if (!req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const post = new Post({ title, img, user: req.user.id });
    await post.save();

    console.log("Post saved successfully:", post);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ 2. Get All Posts (Including User Info, Comments, and Likes)
router.get("/data", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username img") // Post owner's username & profile pic
      .populate("comments.user", "username img") // Commenters' usernames & profile pics
      .populate("likes", "username img"); // Users who liked the post

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 3. Add a Comment to a Post
router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user.id; // Get user ID from token

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ message: "Comment added", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ 4. Like/Unlike a Post
router.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({ message: "Post unliked", post });
    }

    // Like the post
    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: "Post liked", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
