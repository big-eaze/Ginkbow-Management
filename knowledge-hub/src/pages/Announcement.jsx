import React, { useState, useEffect, useContext } from "react";
import axios from "../Utils/axios.js";
import { FaPlus, FaTimes } from "react-icons/fa";
import { MenuContext } from "../Utils/MenuContext.jsx";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { adminNavItems } from "../data/navItems";
import "./Announcement.css";
import getTimeAgo from "../Utils/getTimeAgo.js";



function Announcement() {
  const { announcement, setAnnouncement } = useContext(MenuContext);

  async function loadAnnouncement() {
    try {
      const responseAnnouncement = await axios.get("/announcements");

      setAnnouncement(responseAnnouncement.data);

    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  }

  useEffect(() => {
    loadAnnouncement();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [activeTab, setActiveTab] = useState("students");
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    content: "",
    receiver: ""
  });

  const filteredAnnouncements = announcement.filter(
    (ann) => ann.receiver === activeTab
  );

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {

    e.preventDefault();
    
    try {
      if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.receiver) {
        alert("Please fill in all fields.");
        return;
      }
       await axios.post("/announcements", newAnnouncement);
      //setAnnouncement((prev) => [...prev, response.data.announcement]);
      await loadAnnouncement();
      setShowForm(false);
      setNewAnnouncement((prev) => ({ ...prev, title: "", content: "", receiver: "" }));
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  return (
    <div className="announcement-page">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      <div className="announcement-container">
        <Dir navItems={adminNavItems} />
        <div className="announcement-tabs">
          <button
            className={`tab-button ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            To Students
          </button>
          <button
            className={`tab-button ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => setActiveTab("staff")}
          >
            To Staff
          </button>
        </div>

        <div className="announcement-list">
          <h3>{activeTab === "students" ? "Student Announcements" : "Staff Announcements"}</h3>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((info) => (
              <div key={info.id} className="announcement-card">
                 <p className="announcement-date">
                  {getTimeAgo(info.createdAt)} 
                </p>
                <h4 className="announcement-title">{info.title}</h4>
                <p className="announcement-content">{info.content}</p>
              </div>
            ))
          ) : (
            <p className="no-announcements">No announcements available.</p>
          )}
        </div>

        <button className="add-announcement-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Announcement
        </button>

        {showForm && (
          <div className="announcement-modal">
            <div className="modal-content">
              <button className="close-modal-btn" onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
              <h3>Add New Announcement</h3>
              <form className="add-content-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="receiver"
                  value={newAnnouncement.receiver}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select Receiver
                  </option>
                  <option value="students">Students</option>
                  <option value="staff">Staff</option>
                  <option value="both">Both</option>
                </select>
                <textarea
                  name="content"
                  placeholder="Write your announcement here..."
                  value={newAnnouncement.content}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <button type="submit" className="submit-announcement-btn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcement;