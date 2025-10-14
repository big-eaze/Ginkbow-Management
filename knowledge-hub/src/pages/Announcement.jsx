import React, { useState, useEffect, useContext } from "react";
import axios from "../Utils/axios.js";
import { FaPlus, FaTimes } from "react-icons/fa";
import { MenuContext } from "../Utils/MenuContext.jsx";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { adminNavItems } from "../data/navItems";
import getTimeAgo from "../Utils/getTimeAgo.js";
import NavMobile from "../components/MobileNav.jsx";

function Announcement() {
  const { announcement, setAnnouncement, displayMenu } = useContext(MenuContext);
  const [activeTab, setActiveTab] = useState("students");
  const [showForm, setShowForm] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    content: "",
    receiver: "",
  });

  async function loadAnnouncement() {
    try {
      const response = await axios.get("/announcements");
      setAnnouncement(response.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  }

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const filteredAnnouncements = announcement.filter(
    (ann) => ann.receiver === activeTab || ann.receiver === "both"
  );

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.receiver) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("/announcements", newAnnouncement);
      await loadAnnouncement();
      setShowForm(false);
      setNewAnnouncement({ title: "", content: "", receiver: "" });
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      {displayMenu && <NavMobile navItems={adminNavItems} subtitle="Admin Panel" />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-80 p-2 sm:p-6 md:p-8">
        <Dir navItems={adminNavItems} />

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
          <div className="flex gap-3 flex-wrap">
            {["students", "staff"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-cyan-600/20 border border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-900/30"
                  : "bg-[#101a2a] text-gray-400 hover:text-gray-200 hover:bg-[#162237] border border-transparent"
                  }`}
              >
                {tab === "students" ? "To Students" : "To Staff"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 w-[90%] mx-auto sm:mx-0 sm:w-auto justify-center"
          >
            <FaPlus className="text-sm" /> Add Announcement
          </button>
        </header>

        {/* Announcements Section */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {activeTab === "students" ? "Student Announcements" : "Staff Announcements"}
          </h3>

          {filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredAnnouncements.map((info) => (
                <div
                  key={info.id}
                  className="bg-[#0d1825]/80 border border-[#1e2b3c] rounded-2xl p-5 shadow-lg shadow-cyan-900/10 hover:shadow-cyan-800/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400">{getTimeAgo(info.createdAt)}</p>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${info.receiver === "students"
                        ? "bg-cyan-600/20 text-cyan-400"
                        : info.receiver === "staff"
                          ? "bg-amber-600/20 text-amber-400"
                          : "bg-green-600/20 text-green-400"
                        }`}
                    >
                      {info.receiver}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                    {info.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {info.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-10 text-center italic">
              No announcements available.
            </p>
          )}
        </section>
      </div>

      {/* Announcement Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8 overflow-y-auto">
          <div className="bg-[#0b1523]/90 border border-[#1e2b3c] rounded-2xl shadow-xl w-full max-w-lg relative p-5 sm:p-8">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition"
            >
              <FaTimes size={18} />
            </button>

            <h3 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4 text-center">
              Add New Announcement
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={handleInputChange}
                className="w-full p-3 sm:p-4 bg-[#101a2a] rounded-lg border border-[#1e2b3c] text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              />

              <select
                name="receiver"
                value={newAnnouncement.receiver}
                onChange={handleInputChange}
                className="w-full p-3 sm:p-4 bg-[#101a2a] rounded-lg border border-[#1e2b3c] text-gray-200 focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                <option value="">Select Receiver</option>
                <option value="students">Students</option>
                <option value="staff">Staff</option>
                <option value="both">Both</option>
              </select>

              <textarea
                name="content"
                placeholder="Write your announcement here..."
                value={newAnnouncement.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 sm:p-4 bg-[#101a2a] rounded-lg border border-[#1e2b3c] text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              ></textarea>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg shadow-md transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcement;
