import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // Move your CSS to a separate file
import CreatePost from "../components/CreatePost";
import ProfileCard from "../components/ProfileCard";
const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/data");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(
        `http://localhost:3000/user/${postId}/like`,
        {}, // Empty body (if no extra data is needed)
        { withCredentials: true } // Move withCredentials to config
      );
      fetchPosts(); // Refresh posts after liking
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (postId, commentText, setCommentText) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures cookies (JWT) are sent
          body: JSON.stringify({ text: commentText }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Comment added:", data);

      setCommentText(""); // Clear input after posting
      fetchPosts(); // ✅ Refresh posts to show the new comment
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="home-container">
  
      <CreatePost fetchPosts={fetchPosts} />
      <h1 id="feed">Feed</h1>
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div className="post-container" key={post._id}>
              <div className="post-header">
                <img
                  className="profile-pic"
                  src={post.user?.img || "https://via.placeholder.com/40"}
                  alt="Profile"
                />
                <h3>{post.user?.username || "Unknown"}</h3>
              </div>
              <img className="post-img" src={post.img} alt="Post" />
              <h4>{post.title}</h4>
              <div className="likes-section">
                <button className="like-btn" onClick={() => likePost(post._id)}>
                  ❤️ {post.likes.length} Likes
                </button>
              </div>
              <CommentSection post={post} addComment={addComment} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ post, addComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  return (
    <div>
      <button
        className="toggle-comments-btn"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? "💬 Hide Comments" : "💬 Show Comments"}
      </button>
      {showComments && (
        <div className="comments-section">
          <h5>Comments</h5>
          {post.comments.map((comment, index) => (
            <div className="comment" key={index}>
              <img
                src={comment.user?.img || "https://via.placeholder.com/30"}
                alt="Profile"
              />
              <p>
                <strong>{comment.user?.username || "Unknown"}:</strong>{" "}
                {comment.text}
              </p>
            </div>
          ))}
          <input
            type="text"
            className="comment-box"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            className="comment-btn"
            onClick={() => addComment(post._id, commentText, setCommentText)}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
