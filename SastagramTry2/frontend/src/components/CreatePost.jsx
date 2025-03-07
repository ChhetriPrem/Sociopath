import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreatePost.css"; // Importing CSS for styling
import ProfileCard from "./ProfileCard";

const CreatePost = ({ fetchPosts }) => {
  const [user, setUser] = useState({ username: "", img: "" });
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/user/profile",
          {},
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({ username: "User not found", img: "" });
      }
    };
    fetchUser();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !image) {
      setStatus("Please enter a title and select an image.");
      return;
    }

    setStatus("Uploading...");

    try {
      const formData = new FormData();
      formData.append("image", image);

      // Upload image first
      const uploadResponse = await axios.post(
        "http://localhost:3000/user/upload",
        formData
      );

      if (!uploadResponse.data.imageUrl) {
        throw new Error("Image upload failed");
      }

      // Create post with uploaded image URL

      await axios.post(
        "http://localhost:3000/user/createPost",
        {
          title,
          img: uploadResponse.data.imageUrl,
        },
        { withCredentials: true }
      );

      setStatus("✅ Post created successfully!");
      setTitle("");
      setImage(null);
      setPreview("");
      setShowForm(false); // Hide form after successful submission

      fetchPosts(); // Refresh posts on Home
    } catch (error) {
      console.error("Error:", error);
      setStatus("❌ Error creating post.");
    }
  };

  return (
    <div className="post-wrapper">
      <div id="navProfile">
        <img src={user.img || "https://via.placeholder.com/50"} alt="Profile" />
        <span>{user.username}</span>
      </div>
      <button
        className="create-post-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close" : "Create Post"}
      </button>

      {showForm && (
        <div className="create-post-container">
          <div className="profile">
            <img
              src={user.img || "https://via.placeholder.com/50"}
              alt="Profile"
            />
            <span>{user.username}</span>
          </div>
          <h2>Create a Post</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              required
            />

            <label className="file-label">
              <input type="file" onChange={handleImageChange} required />
              Choose Image
            </label>

            {preview && (
              <img src={preview} alt="Preview" className="preview-img" />
            )}
            <button type="submit">Upload & Post</button>
          </form>
          <p className="status">{status}</p>
            </div>
      )}
    </div>
  );
};

export default CreatePost;
