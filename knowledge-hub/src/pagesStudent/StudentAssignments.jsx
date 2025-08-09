import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import "./StudentAssignments.css";

function StudentAssignments() {
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [userClass, setUserClass] = useState("");


  async function fetchProfile() {
    try {
      const res = await axios.get("/auth/profile");
      setUserClass(res.data.user.class);
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  }

  async function fetchAssignments(studentClass) {
    try {
      const response = await axios.get(`/assignments/${studentClass}`);
      setStudentAssignments(response.data.tasks);
    } catch (err) {
      console.error("Error fetching assignments", err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (userClass) {
      fetchAssignments(userClass);
    }
  }, [userClass]);

  return (
    <div className="student-assignments">
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      <div className="assignments-container">
        <Dir navItems={studentNavItems} />
        <h1 className="assignments-heading">Assignments</h1>
        {(Array.isArray(studentAssignments) && studentAssignments.length > 0) ? (
          <ul className="assignments-list">
            {studentAssignments.map((assignment, idx) => (
              <li key={idx} className="assignment-item">
                <h2 className="assignment-title">{assignment.title}</h2>
                <p className="assignment-due-date">Due Date: {assignment.dueDate}</p>
                <p className="assignment-description">{assignment.description}</p>
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
            <h2 className="fallback-title">No Assignments available</h2>
            <p className="fallback-message">
              You currently have no Assignments to complete. Please check back later or
              contact your class teacher for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAssignments;
