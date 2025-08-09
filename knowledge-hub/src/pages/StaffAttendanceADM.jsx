import React, {  useEffect, useState, useContext } from "react";
import axios from "../Utils/axios.js";
import { MenuContext } from "../Utils/MenuContext.jsx";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { adminNavItems } from "../data/navItems";
import "./StaffAttendanceADM.css";


function StaffAttendanceADM() {
  const { staffAtt, setStaffAtt } = useContext(MenuContext); // Access staffAtt from context
  const [selectedDate] = useState("2025-06-25"); // Default to today's date
  const [filteredAttendance, setFilteredAttendance] = useState([]);


  useEffect(() => {

    const attendanceForDate = staffAtt?.find((entry) => entry.date === selectedDate);
    if (attendanceForDate) {
      setFilteredAttendance(attendanceForDate.staffStatus || []);
    } else {
      setFilteredAttendance([]);
    }
  }, [selectedDate, staffAtt]);

  useEffect(() => {
    async function loadStaffAttendance() {
      try {
        const responseStaffAttendance = await axios.get("/staff-attendance?expand=staff");
        setStaffAtt(responseStaffAttendance.data);
      } catch (err) {
        console.error("error loading staff attendance", err)
      }
    }
    loadStaffAttendance();
    //eslint-disable-next-line
  }, [])




  return (
    <div className="staff-attendance-sheet">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      <div className="attend-container">
        <Dir navItems={adminNavItems} />
        <h1 className="attendance-heading">Staff Attendance Sheet</h1>
        <div className="date-picker">
          <label htmlFor="attendance-date">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            readOnly
          />
        </div>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((staff, idx) => (
                <tr key={staff.id}>
                  <td>{idx + 1}</td>
                  <td>{staff.staffDetails.name}</td>
                  <td className={`status ${staff.status.toLowerCase()}`}>
                    {staff.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No attendance data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffAttendanceADM;