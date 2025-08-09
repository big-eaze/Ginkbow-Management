import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import axios from "../Utils/axios.js";
import { StaffNavItems } from "../data/navItems";
import "./StudentsAttendanceFF.css";


function StudentsAttendanceFF() {


  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date

  const [students, setStudents] = useState([]);

  const [modalData, setModalData] = useState({ isOpen: false, student: null, status: "" });

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      await fetchStudents(user.class);
    } catch (err) {
      console.error("error fetching profile data", err);
    }
  }

  useEffect(() => {
    loadProfile();
    //eslint-disable-next-line
  }, [])



  async function fetchStudents(userClass) {
    try {
      const response = await axios.get(`/students/${userClass}`)
      const students = response.data.students
      setStudents(() => (
        students.map((student, idx) => ({
          id: idx + 1,
          admissionNumber: student.admissionNumber,
          name: student.name,
          status: "not marked"
        }))
      ))
    } catch (err) {
      console.error("error fetching students data", err);
    }
  }

  async function addStudentAttendance() {
    try {
      await axios.post("/student-attendance", {
        admissionNumber: modalData.student.admissionNumber,
        date: selectedDate,
        status: modalData.status,
      });
    } catch (err) {
      console.error("Error sending students attendance", err);
    }
  }



  //logic for status change
  function handleStatusChange(id, status) {
    const student = students.find((student) => student.id === id);
    setModalData({ isOpen: true, student, status });
  };

  //logic for status confirmation (popUp)
  async function confirmStatusChange() {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === modalData.student.id ? { ...student, status: modalData.status } : student
      )
    );

    await addStudentAttendance();
    setModalData({ isOpen: false, student: null, status: "" });
  };


  //logic for closing modal
  const closeModal = () => {
    setModalData({ isOpen: false, student: null, status: "" });
  };


  
  //logic for date
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };


  return (
    <div className="students-attendance">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      <div className="attendance-container">
        <Dir navItems={StaffNavItems} />
        <h1 className="att-heading">Students Attendance</h1>
        <div className="date-picker">
          <label htmlFor="attendance-date">Date:</label>
          <input
            type="date"
            id="attendance-date"
            value={selectedDate}
            onChange={handleDateChange}
            readOnly
          />
        </div>
        <table className="att-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.status}</td>
                <td>
                  <button
                    disabled={student.status !== "not marked"}
                    className={`status-button present ${student.status === "present" ? "active" : ""
                      }`}
                    onClick={() => handleStatusChange(student.id, "present")}
                  >
                    Present
                  </button>
                  <button
                    disabled={student.status !== "not marked"}
                    className={`status-button absent ${student.status === "absent" ? "active" : ""
                      }`}
                    onClick={() => handleStatusChange(student.id, "absent")}
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalData.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Status Change</h2>
            <p>
              Are you sure you want to mark <strong>{modalData.student.name}</strong> as <strong>{modalData.status}</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-button confirm" onClick={confirmStatusChange}>
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

export default StudentsAttendanceFF;