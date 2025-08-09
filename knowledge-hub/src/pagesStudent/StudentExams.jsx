import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import "./StudentExams.css";

function StudentExams() {
  const [exams, setExams] = useState([]);
  const [userClass, setUserClass] = useState("");


  async function fetchProfile() {
    try {
      const res = await axios.get("/auth/profile");
      setUserClass(res.data.user.class);
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  }

  async function fetchExams(studentClass) {
    try {
      const response = await axios.get(`/exam-timetable/upcoming-exams/${studentClass}`);
      setExams(response.data);
    } catch (err) {
      console.error("Error fetching exam data", err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (userClass) {
      fetchExams(userClass);
    }
  }, [userClass]);

  return (
    <div className="student-exams">
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      <div className="exams-container">
        <Dir navItems={studentNavItems} />
        <h1 className="exams-heading">Upcoming Exams</h1>
        {exams.length > 0 ? (
          <ul className="exams-list">
            {exams.map((exam) => (
              <li key={exam.id} className="exam-item">
                <h2 className="exam-subject">{exam.subject}</h2>
                <p className="exam-date">Date: {exam.date}</p>
                <p className="exam-time">Time: {exam.time}</p>
                <p className="exam-venue">Venue: {exam.venue}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="fallback-ui">
            <img
              src="/empty.png"
              alt="No Exams"
              className="fallback-image"
            />
            <h2 className="fallback-title">No Upcoming Exams</h2>
            <p className="fallback-message">
              You currently have no exams scheduled. Please check back later or
              contact your class teacher for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentExams;