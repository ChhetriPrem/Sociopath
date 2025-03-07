import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    bio: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Check if user is already authenticated (using backend)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/check", {
          withCredentials: true, // Ensures cookies are sent
        });

        if (res.data.authenticated) {
          navigate("/"); // Redirect to home if logged in
        }
      } catch (error) {
        console.log("User not authenticated");
      }
    };

    checkAuth();
  }, [navigate]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submission (Login/Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const endpoint = isLogin
      ? "http://localhost:3000/auth/login"
      : "http://localhost:3000/auth/signup";

    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Send credentials (cookies)
      });

      setMessage("Success!");
      setLoading(false);
      navigate("/"); // Redirect after login
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>

        {message && <p className="auth-message">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <input
                type="text"
                name="img"
                placeholder="Profile Image URL"
                value={formData.img}
                onChange={handleChange}
                className="auth-input"
              />
              <input
                type="text"
                name="bio"
                placeholder="Bio"
                value={formData.bio}
                onChange={handleChange}
                className="auth-input"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="auth-input"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
