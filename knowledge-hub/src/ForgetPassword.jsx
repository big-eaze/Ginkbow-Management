import React, { useState } from "react";
import axios from "./Utils/axios.js";
import "./ForgetPassword.css";


function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/forgot-password", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-overall">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form className="forgot-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-password-input"
          />
          <button type="submit" className="forgot-password-btn" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
