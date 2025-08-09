import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import getTimeAgo from "../Utils/getTimeAgo.js";
import "./StudentAnnouncements.css";


function StudentAnnouncements() {
  const [studentAnnouncement, setStudentAnnouncement] = useState([]);

  async function fetchAnnouncement() {
    try {
      const response = await axios.get("/announcements");
      const announcement = Array.isArray(response.data) ? response.data : [response.data];
      const studentsOnly = announcement.filter(ann => ann.receiver === "students");
      setStudentAnnouncement(studentsOnly);
    } catch (err) {
      console.error("Error fetching announcements", err);
    };
  }

  useEffect(() => {
    fetchAnnouncement();
  }, [])
  return (
    <div className="student-announcements">
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      <div className="announcements-container">
        <Dir navItems={studentNavItems} />
        <h1 className="announcements-heading">Announcements</h1>
        <ul className="announcements-list">
          {studentAnnouncement.map((announcement) => (
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

export default StudentAnnouncements;