import { Link } from 'react-router-dom';
import React, { Fragment, useState } from 'react';
import axios from './Utils/axios.js';

function RegistrationPage() {
  const [userRole, setUserRole] = useState("");

  const handleRoleSelection = (e) => setUserRole(e.target.value);

  async function handleSignUp(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(
        "/auth/signup",
        { ...data },
        { headers: { "content-type": "application/json" } }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.username);

      alert("Registration successful");

      window.location.href =
        userRole === "admin"
          ? "/ad-dashboard"
          : userRole === "student"
            ? "/st-dashboard"
            : "/ff-dashboard";
    } catch (error) {
      console.error("Signup Error:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md bg-[#11182799] backdrop-blur-md rounded-2xl shadow-xl p-8 relative border border-gray-200 dark:border-gray-800">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[#22d3ee] text-center mb-6  tracking-wide">
          Aurora INNOVATION
        </h2>

        {/* Registration Form */}
        <form className="space-y-5" onSubmit={handleSignUp}>
          <select
            defaultValue=""
            onChange={handleRoleSelection}
            className="w-full px-4 py-3 bg-gray-400 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400 "
          >
            <option value="" disabled hidden>
              Select role
            </option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>

          <Fragment>
            {userRole && (
              <>
                <input type="hidden" name="role" value={userRole} />

                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400  "
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                />

                {userRole !== "student" && (
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                  />
                )}

                <input
                  type="text"
                  name={
                    userRole === "admin"
                      ? "adminId"
                      : userRole === "student"
                        ? "admissionNumber"
                        : "staffId"
                  }
                  placeholder={
                    userRole === "admin"
                      ? "Admin ID"
                      : userRole === "student"
                        ? "Admission Number"
                        : "Staff ID"
                  }
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                />

                {userRole === "staff" && (
                  <>
                    <input
                      type="text"
                      name="class"
                      placeholder="Class"
                      required
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      required
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                    />
                  </>
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400 "
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-400"
                />
              </>
            )}
          </Fragment>

          <button
            type="submit"
            className="w-full py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-white rounded-lg font-semibold shadow-md transition-all duration-300"
          >
            Register
          </button>
        </form>

        {/* Sign In */}
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full mt-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        >
          Sign In
        </button>

        {/* Subtle Footer */}
        <p className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400 tracking-wide">
          © {new Date().getFullYear()} Aurora Innovation
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;
