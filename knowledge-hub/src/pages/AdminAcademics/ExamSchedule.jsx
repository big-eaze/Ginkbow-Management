import React, { useContext, useEffect, useState } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../Utils/MenuContext.jsx";
import axios from "../../Utils/axios.js";
import "./ExamSchedule.css";




function ExamSchedule() {
  const { examSchedule, setExamSchedule } = useContext(MenuContext);
  const navigate = useNavigate();

  
  useEffect(() => {
    async function loadExamData() {
      try {
        const responseExamSchedule = await axios.get("/exam-timetable");
        setExamSchedule(responseExamSchedule.data);
      } catch (err) {
        console.error("error loading exam data", err);
      }
    }

    loadExamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [newExam, setNewExam] = useState({
    class: "",
    subject: "",
    date: "",
    time: "",
    venue: "",
  });

  async function addExam(e) {
    e.preventDefault();

    if (!newExam.class || !newExam.subject || !newExam.date || !newExam.time || !newExam.venue) {
      return;
    }

    try {
      const response = await axios.post("/exam-timetable", newExam);
      console.log(response.data);
      const responseId = response.data.examData.id;
      const responseExamData = response.data.examData;

      setExamSchedule((prev) => {
        return prev.map((cls) => {
          if (cls.id === responseId) {
            return responseExamData;
          }
          return cls;
        })
      });

      setNewExam({
        class: "",
        subject: "",
        date: "",
        time: "",
        venue: ""
      })

    } catch (error) {
      console.log("error adding exam:", error);
    }

  }

  async function deleteExam(subject, className) {


    try {
      await axios.delete(`/exam-timetable/${className}/${subject}`);
      setExamSchedule((prev) => {
        return prev.map((cls) => {
          if (cls.class === className) {
            return {
              ...cls,
              exams: cls.exams.filter(exam => exam.subject !== subject)
            };
          }
          return cls;
        });
      })
    } catch (error) {
      console.log("error deleting exam:", error);
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="exam-timetable-container">
      <div className="back-to-home" onClick={() => navigate("/ad-academics")}>
        <FaArrowLeft className="left" size={30} />
      </div>
      <h2>Exam Timetable</h2>
      {examSchedule.map((examData) => (
        <div className="class-section" key={examData.id}>
          <h3 className="class-header">{examData.class}</h3>
          <table className="exam-timetable">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {examData.exams.map((exam, index) => (
                <tr key={index}>
                  <td>{exam.subject}</td>
                  <td>{exam.date}</td>
                  <td>{exam.time}</td>
                  <td>{exam.venue}</td>
                  <td>
                    <button onClick={(e) => {
                      e.preventDefault();
                      const subject = e.currentTarget.dataset.subject;
                      const className = e.currentTarget.dataset.class;
                      deleteExam(subject, className);
                    }} data-subject={exam.subject} data-class={examData.class} className="delete-exam-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="add-exam-section">
        <form className="add-exam-form" onSubmit={addExam}>
          <input
            type="text"
            name="class"
            placeholder="class"
            className="add-exam-input"
            value={newExam.class}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="add-exam-input"
            value={newExam.subject}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="date"
            className="add-exam-input"
            value={newExam.date}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="time"
            className="add-exam-input"
            value={newExam.time}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            className="add-exam-input"
            value={newExam.venue}
            onChange={handleInputChange}
          />
          <button className="add-exam-btn">Add Exam</button>
        </form>
      </div>
      <button className="send-timetable-btn">Send Timetable</button>
    </div>
  );
}

export default ExamSchedule;