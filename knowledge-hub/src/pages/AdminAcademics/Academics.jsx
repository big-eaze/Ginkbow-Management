import React, { useContext, useEffect, useState } from "react";
import "./Academics.css";
import { Link } from "react-router-dom";
import Nav2 from "../../components/Nav2";
import Dir from "../../components/Dir";
import { adminNavItems } from "../../data/navItems";
import { MenuContext } from "../../Utils/MenuContext";
import axios from "../../Utils/axios.js";


function Academics() {

  const { setClassPopulation } = useContext(MenuContext);


  async function loadClassPopulationData() {
    const responseClassPopulation = await axios.get("/class-population");
    setClassPopulation(responseClassPopulation);
    setClassTotalNumber(responseClassPopulation.data);
  }

  useEffect(() => {


    loadClassPopulationData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [classTotalNumber, setClassTotalNumber] = useState([]);
  const [newClassPopulation, setNewClassPopulation] = useState({
    class: "",
    numberOfStudents: ""
  })


  function handleInputChanges(e) {
    const { name, value } = e.target;
    setNewClassPopulation(
      (prev) => ({
        ...prev,
        [name]: value
      })
    )
  }


  async function updateClassPopulation(e) {
    e.preventDefault();

    setFormSubmitted(true);

    if (!newClassPopulation.class || !newClassPopulation.numberOfStudents) {
      return;
    }

    try {

      const response = await axios.put(`/class-population/${newClassPopulation.class}`,
        { numberOfStudents: newClassPopulation.numberOfStudents }
      )
      setClassTotalNumber(
        (prev) => {
          return prev.map((cls) => {
            if (cls.class === newClassPopulation.class) {
              return { ...cls, numberOfStudents: response.data.classPopulation.numberOfStudents }
            }

            return cls;
          })
        }
      )

      await loadClassPopulationData();

      setNewClassPopulation({
        class: "",
        numberOfStudents: ""
      })
      setFormSubmitted(false);

    } catch (error) {
      console.error("error updating this class", error.response.data || error.message)
    }
  }




  return (
    <div className="overall">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      <div className="academic-container" >
        <Dir navItems={adminNavItems} />
        <h1>Academics Overview</h1>

        {/* Courses Section */}
        <div className="hd-sec-container">
          <div className="courses-section">
            <h2>Classes</h2>
            <ul>
              {classTotalNumber.map((course, index) => (
                <li key={index} className="course-item">
                  <span className="course-name">{course.class}</span>
                  <span className="course-students">{course.numberOfStudents} students</span>
                </li>
              ))}
            </ul>
            <form className="add-course-section" onSubmit={updateClassPopulation}>
              <input
                type="text"
                name="class"
                value={newClassPopulation.class}
                onChange={handleInputChanges}
                placeholder="Enter class"
                className="add-course-input"
              />
              <input
                type="number"
                name="numberOfStudents"
                onChange={handleInputChanges}
                value={newClassPopulation.numberOfStudents}
                placeholder="Number of Students"
                className="add-course-input"
                min="0"
              />

              {formSubmitted && (!newClassPopulation.class || !newClassPopulation.numberOfStudents) && (<div className="error">Please fill out both fields.</div>)}
              <button className="add-course-btn" >
                update
              </button>
            </form>
            <div className="hd-secd">
              {/* Class Schedule Section */}
              <div className="schedule-section">
                <h2>Class Schedule</h2>
                <p>Coming soon...</p>
              </div>

              {/* Exams and Results Section */}
              <div className="exams-section">
                <h2>Exams and Results</h2>
                <p>Manage upcoming exams and upload results here.</p>
                <div className="pop-up">
                  <ul>
                    <Link to="/ad-academics/exam-schedule"><li >Exam Schedule</li></Link>
                    <Link to="/ad-academics/upload-result"><li>Upload Results</li></Link>
                    <Link to="/ad-academics/view-results"><li>View Results</li></Link>
                  </ul>
                </div>
              </div>

              {/* Academic Calendar Section */}
              <div className="calendar-section">
                <h2>Academic Calendar</h2>
                <p>View important academic dates and events.</p>
                <p>Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Academics;