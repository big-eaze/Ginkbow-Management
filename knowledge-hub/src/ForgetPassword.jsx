import React, { useState } from "react";
import axios from "./Utils/axios.js";

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
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] font-poppins">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          {message && <p className="text-green-400 text-sm mt-2 text-center">{message}</p>}
          {error && <p className="text-rose-400 text-sm mt-2 text-center">{error}</p>}
        </form>
        <p className="text-slate-400 text-xs mt-4 text-center">
          Check your email after submission to reset your password.
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;
