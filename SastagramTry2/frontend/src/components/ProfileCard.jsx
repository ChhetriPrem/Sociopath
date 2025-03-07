import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./ProfileCard.css";

const ProfileCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-container">
      {/* Profile Icon to Open Card */}
      <span className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        👤
      </span>

      {isOpen && (
        <motion.div
          className="profile-card"
          ref={cardRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="profile-img"
          />
          <h3 className="profile-name">John Doe</h3>
          <p className="profile-bio">🚀 Passionate about coding & AI</p>
          <p className="profile-location">📍 New York, USA</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileCard;
