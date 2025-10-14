import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../Utils/axios.js";
import Nav2 from "./Nav2";
import Dir from "./Dir";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "./MobileNav.jsx";

function ChangePassword({ navItems, subtitle }) {

  const { displayMenu } = useContext(MenuContext);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFeedback({ error: "", success: "" });
  };

  const toggleVisibility = (key) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return setFeedback({ error: "New passwords do not match", success: "" });
    }

    if (!validatePassword(formData.newPassword)) {
      return setFeedback({
        error: "Password must be at least 8 characters.",
        success: "",
      });
    }

    try {
      const response = await axios.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setFeedback({
        success:
          response.data.message || "Password changed successfully.",
        error: "",
      });

      setTimeout(() => setFeedback({ success: "", error: "" }), 3000);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setFeedback({
        error: err.response?.data?.message || "Error changing password.",
        success: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15]">
      <Nav2 navItems={navItems} subtitle={subtitle} />

      <div className="lg:ml-80 flex flex-col gap-6 p-2 sm:p-6 md:p-8">
        <Dir navItems={navItems} />
        {displayMenu && <NavMobile navItems={navItems} subtitle={subtitle} />}

        <div className="flex justify-center mt-40">
          <div className="w-full max-w-md bg-[#FFFFFF06] rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
              Update Your Password
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
                {showPassword.current ? (
                  <FaEyeSlash
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => toggleVisibility("current")}
                  />
                ) : (
                  <FaEye
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => toggleVisibility("current")}
                  />
                )}
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
                {showPassword.new ? (
                  <FaEyeSlash
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => toggleVisibility("new")}
                  />
                ) : (
                  <FaEye
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => toggleVisibility("new")}
                  />
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
                {showPassword.confirm ? (
                  <FaEyeSlash
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => toggleVisibility("confirm")}
                  />
                ) : (
                  <FaEye
                    className="absolute right-4 top-3 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => toggleVisibility("confirm")}
                  />
                )}
              </div>

              {/* Feedback Messages */}
              {feedback.error && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {feedback.error}
                </p>
              )}
              {feedback.success && (
                <p className="text-green-500 text-sm font-medium text-center">
                  {feedback.success}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-all duration-300"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
