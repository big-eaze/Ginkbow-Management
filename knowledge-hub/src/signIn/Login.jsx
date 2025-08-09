import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../Utils/axios.js";
import "./Login.css";

function Login() {
  const [inputValues, setInputValues] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();

    const { username, password } = inputValues;

    if (!username || !password) {

      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password has to been 8 characters.");
      return;
    }


    try {
      const response = await axios.post(
        "/auth/signin",
        { username, password },
        {
          headers: {
            "content-type": "application/json",
          }
        }
      );

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        window.location.href = "/ad-dashboard";
      } else if (role === "student") {
        window.location.href = "/st-dashboard";
      } else if (role === "staff") {
        window.location.href = "/ff-dashboard";
      } else {
        setErrorMessage("Invalid user role.");
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "An error occurred during login."
      );
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your account</p>
        <form onSubmit={handleSignIn} className="login-form">
          <div className="form-contain">
            <input
              type="text"
              name="username"
              placeholder="Username"
              data-testid="username-field"
              value={inputValues.username}
              onChange={handleInputChange}
              className="login-input"
            />
          </div>
          <div className="form-contain">
            <input
              type="password"
              name="password"
              placeholder="Password"
              data-testid="password-field"
              value={inputValues.password}
              onChange={handleInputChange}
              className="login-input"
            />
          </div>
          {errorMessage && <p data-testid="error-message" className="error-message">{errorMessage}</p>}
          <button data-testid="signin-btn" type="submit" className="login-btn">
            Sign In
          </button>
        </form>
        <div className="login-links">
          <Link to="/forget-password" className="forgot-password">
            Forgot your password?
          </Link>
          <Link to="/registration" className="register-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;