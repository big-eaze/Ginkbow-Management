import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../Utils/axios.js";
import Nav2 from "./Nav2";
import Dir from "./Dir";
import "./ChangePassword.css";

function ChangePassword({ navItems, subtitle }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFeedback({ error: "", success: "" });
  };

  const toggleVisibility = (key) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };


  const validatePassword = (password) => {
    const isLongEnough = password.length >= 8;
    return isLongEnough;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return setFeedback({ error: "New passwords do not match", success: "" });
    }

    if (!validatePassword(formData.newPassword)) {
      return setFeedback({
        error: "Password must be at least 8 characters.",
        success: ""
      });
    }

    try {
      const response = await axios.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      console.log(response.data);
      
      setFeedback({ success: response.data.message || "Password changed successfully", error: "" });
      
      setTimeout(() => {      
        setFeedback({ success: "", error: "" });
      }, 3000);

      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setFeedback({ error: err.response?.data?.message || "Error changing password", success: "" });
    }
  };

  return (
    <div className="overall">
      <Nav2 navItems={navItems} subtitle={subtitle} />
      <div className="sub-password-change-container">
        <Dir navItems={navItems} />

        <div className="support-container">
          <div className="cp-container">
            <form className="password-form" onSubmit={handleSubmit}>
              <h2>Update Your Password</h2>

              <div className="pnc-container">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
                {showPassword.current ? (
                  <FaEyeSlash className="local-icon" onClick={() => toggleVisibility("current")} />
                ) : (
                  <FaEye className="local-icon" onClick={() => toggleVisibility("current")} />
                )}
              </div>

              <div className="pnc-container">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                />
                {showPassword.new ? (
                  <FaEyeSlash className="local-icon" onClick={() => toggleVisibility("new")} />
                ) : (
                  <FaEye className="local-icon" onClick={() => toggleVisibility("new")} />
                )}
              </div>

              <div className="pnc-container">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {showPassword.confirm ? (
                  <FaEyeSlash className="local-icon" onClick={() => toggleVisibility("confirm")} />
                ) : (
                  <FaEye className="local-icon" onClick={() => toggleVisibility("confirm")} />
                )}
              </div>

              {feedback.error && <p className="error-msg">{feedback.error}</p>}
              {feedback.success && <p className="success-msg">{feedback.success}</p>}

              <button type="submit" className="change-btn">Change Password</button>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
