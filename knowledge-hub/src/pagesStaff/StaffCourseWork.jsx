import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { StaffNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import "./StaffCourseWork.css";

function StaffCourseWork() {



  // State for assignments
  const [assignments, setAssignments] = useState([]);
  const [userClass, setUserClass] = useState("");
  const [modal, setModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  });



  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      setUserClass(user.class);
      await fetchAssignments(user.class);
    } catch (err) {
      console.error("error fetching profile data", err);
    }
  }



  useEffect(() => {
    loadProfile();
    //eslint-disable-next-line
  }, [])




  async function fetchAssignments(theClass) {
    try {
      const response = await axios.get(`/assignments/${theClass}`)
      setAssignments(response.data.tasks);
    } catch (err) {
      console.error("error fetching assignments", err);
    }
  }












  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };



  // Handle assignment submission
  async function handleAddAssignment(e) {
    e.preventDefault();
    setModal(true);
  };


  
  async function confirmAssignmentSubmission() {
    try {
      if (newAssignment.title && newAssignment.description && newAssignment.dueDate) {

        await axios.post(`/assignments/${userClass}`, newAssignment
        );
        await fetchAssignments(userClass);

        setModal(false);

        setNewAssignment({ title: "", description: "", dueDate: "" }); // Reset form
      }
    } catch (err) {
      console.error("error sending assignment", err);

    }
  }




  function closeModal() {
    setModal(false);
  }

  return (
    <div className="course-work">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      <div className="course-work-container">
        <Dir navItems={StaffNavItems} />
        <h1 className="course-work-heading">Course Work</h1>
        <form className="assignment-form" onSubmit={handleAddAssignment}>
          <h2>Assign a New Task</h2>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newAssignment.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newAssignment.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={newAssignment.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <button type="submit" className="submit-button">
              send Assignment
            </button>
          </div>
        </form>
        <div className="assignments-list">
          <h2>Assigned Tasks</h2>
          {assignments.length === 0 ? (
            <p>No assignments added yet.</p>
          ) : (
            <>
              <ul>
                {assignments.map((assignment, idx) => (
                  <li key={idx + 1} className="assignment-item">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p>Due Date: {assignment.dueDate}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Action</h2>
            <p>
              Are you sure you want to send this <strong>task</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-button confirm" onClick={confirmAssignmentSubmission}>
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

export default StaffCourseWork;