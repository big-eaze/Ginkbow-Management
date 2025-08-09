import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import axios from "../Utils/axios.js";
import { StaffNavItems } from "../data/navItems";
import getTimeAgo from "../Utils/getTimeAgo.js";
import "./StaffAnnouncement.css";


function StaffAnnouncement() {

  const [announcements, setAnnouncements] = useState([]);

  async function fetchAnnouncements() {
    try {
      const response = await axios.get("/announcements");
      const announc = response.data;
      const StaffAnnouncement = announc.filter((ann) => ann.receiver === "staff");
      setAnnouncements(StaffAnnouncement);
    } catch (err) {

      console.error("error fetching announcements", err)
    }

  }


  
  useEffect(() => {
    fetchAnnouncements();
  }, [])

  return (
    <div className="staff-announcements">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      <div className="announcements-container">
        <Dir navItems={StaffNavItems} />
        <h1 className="announcements-heading">Announcements</h1>
        <ul className="announcements-list">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="announcement-item">
              <p className="announcement-date">{getTimeAgo(announcement.createdAt)}</p>
              <h2 className="announcement-title">{announcement.title}</h2>
              <p className="announcement-description">{announcement.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StaffAnnouncement;