import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../Utils/MenuContext.jsx";
import axios from "../../Utils/axios.js";

function ExamSchedule() {
  const { examSchedule, setExamSchedule } = useContext(MenuContext);
  const navigate = useNavigate();

  const [newExam, setNewExam] = useState({
    class: "",
    subject: "",
    date: "",
    time: "",
    venue: "",
  });

  useEffect(() => {
    async function loadExamData() {
      try {
        const responseExamSchedule = await axios.get("/exam-timetable");
        setExamSchedule(responseExamSchedule.data);
      } catch (err) {
        console.error("Error loading exam data", err);
      }
    }
    loadExamData();
  }, []);

  async function addExam(e) {
    e.preventDefault();

    if (
      !newExam.class ||
      !newExam.subject ||
      !newExam.date ||
      !newExam.time ||
      !newExam.venue
    )
      return;

    try {
      const response = await axios.post("/exam-timetable", newExam);
      const newExamData = response.data.examData;

      setExamSchedule((prev) => [...prev, newExamData]);
      setNewExam({ class: "", subject: "", date: "", time: "", venue: "" });
    } catch (error) {
      console.error("Error adding exam:", error);
    }
  }

  async function deleteExam(subject, className) {
    try {
      await axios.delete(`/exam-timetable/${className}/${subject}`);
      setExamSchedule((prev) =>
        prev.map((cls) =>
          cls.class === className
            ? { ...cls, exams: cls.exams.filter((exam) => exam.subject !== subject) }
            : cls
        )
      );
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 dark:text-gray-100 p-6 md:p-10">
      {/* Back Button */}
      <div
        onClick={() => navigate("/ad-academics")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer mb-6 transition"
      >
        <FaArrowLeft />
        <span>Back</span>
      </div>

      <h2 className="text-3xl font-semibold mb-8">🧾 Exam Timetable</h2>

      {/* Timetable */}
      {examSchedule.length > 0 ? (
        examSchedule.map((examData) => (
          <div
            key={examData.id}
            className="bg-[#FFFFFF06] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 mb-8"
          >
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center">
              <h3 className="text-xl font-semibold">{examData.class}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-neutral-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Subject</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Time</th>
                    <th className="py-3 px-4 font-medium">Venue</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examData.exams.map((exam, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                    >
                      <td className="py-3 px-4">{exam.subject}</td>
                      <td className="py-3 px-4">{exam.date}</td>
                      <td className="py-3 px-4">{exam.time}</td>
                      <td className="py-3 px-4">{exam.venue}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteExam(exam.subject, examData.class)}
                          className="text-red-500 hover:text-red-700 font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No exam data available yet.
        </p>
      )}

      {/* Add Exam Form */}
      <div className="bg-[#FFFFFF06] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 p-6 mt-10">
        <h3 className="text-xl font-semibold mb-4">➕ Add New Exam</h3>
        <form
          onSubmit={addExam}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={newExam.class}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={newExam.subject}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            name="date"
            value={newExam.date}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="time"
            name="time"
            value={newExam.time}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={newExam.venue}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="md:col-span-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Add Exam
          </button>
        </form>
      </div>

      {/* Send Button */}
      <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
          Send Timetable
        </button>
      </div>
    </div>
  );
}

export default ExamSchedule;
