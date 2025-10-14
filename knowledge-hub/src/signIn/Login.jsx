import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../Utils/axios.js";

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
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await axios.post(
        "/auth/signin",
        { username, password },
        { headers: { "content-type": "application/json" } }
      );

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") window.location.href = "/ad-dashboard";
      else if (role === "student") window.location.href = "/st-dashboard";
      else if (role === "staff") window.location.href = "/ff-dashboard";
      else setErrorMessage("Invalid user role.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#22d3ee]">
          Welcome Back
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Sign in to access your account
        </p>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={inputValues.username}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400 "
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={inputValues.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800  border border-gray-700 rounded-lg  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <Link
            to="/forget-password"
            className="hover:text-blue-400 transition-colors"
          >
            Forgot your password?
          </Link>
          <Link
            to="/registration"
            className="mt-3 sm:mt-0 hover:text-blue-400 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
