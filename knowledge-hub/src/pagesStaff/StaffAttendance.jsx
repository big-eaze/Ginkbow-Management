import React, { useState, useEffect } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import axios from "../Utils/axios.js";
import { StaffNavItems } from "../data/navItems";
import "./StaffAttendance.css";

function StaffAttendance() {
  // State for attendance status
  const [attendanceStatus, setAttendanceStatus] = useState("Not Marked");
  const [userStaffId, setUserStaffId] = useState("");

  // State for selected date
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [modalData, setModalData] = useState({ isOpen: false, status: "" });


  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      setUserStaffId(user.staffId);
    } catch (err) {
      console.error("error fetching profile data", err);
    }
  }

  useEffect(() => {
    loadProfile();

  }, [])

  // Handle attendance marking
  function markAttendance(status) {
    setModalData({ isOpen: true, status: status })
  };

  async function confirmStatusChange() {
    try {
      await axios.post(`/staff-attendance/${userStaffId}`, {
        date: selectedDate,
        status: modalData.status
      })
      setAttendanceStatus(modalData.status);
      setModalData({ isOpen: false, status: "", });
    } catch (err) {
      console.error("Error confirming status change", err);
    }
  }
  function closeModal() {
    setModalData({ isOpen: false, status: "", });
  }

  return (
    <div className="my-attendance">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      <div className="attendance-container">
        <Dir navItems={StaffNavItems} />
        <h1 className="attendance-heading">My Attendance</h1>
        <div className="date-picker">
          <label htmlFor="attendance-date">Date:</label>
          <input
            type="date"
            id="attendance-date"
            value={selectedDate}
            readOnly
          />
        </div>
        <div className="attendance-status">
          <h2>Attendance Status: {attendanceStatus}</h2>
        </div>
        <div className="attendance-actions">
          <button
            disabled={attendanceStatus !== "Not Marked"}
            className={`status-btn present ${attendanceStatus === "Present" ? "active" : ""
              }`}
            onClick={() => markAttendance("Present")}
          >
            Mark Present
          </button>
          <button
            disabled={attendanceStatus !== "Not Marked"}
            className={`status-btn absent ${attendanceStatus === "Absent" ? "active" : ""
              }`}
            onClick={() => markAttendance("Absent")}
          >
            Mark Absent
          </button>
        </div>
      </div>
      {modalData.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Status Submission</h2>
            <p>
              Are you sure you want to mark as <strong>{modalData.status}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="modal-button confirm"
                onClick={confirmStatusChange}>
                Confirm
              </button>
              <button className="modal-button cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAttendance;