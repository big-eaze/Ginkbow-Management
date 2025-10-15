import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav2 from "../../components/Nav2";
import Dir from "../../components/Dir";
import { adminNavItems } from "../../data/navItems";
import { MenuContext } from "../../Utils/MenuContext";
import axios from "../../Utils/axios.js";
import { FaBook } from "react-icons/fa";
import NavMobile from "../../components/MobileNav.jsx";

function Academics() {
  const { setClassPopulation, displayMenu } = useContext(MenuContext);

  const [classTotalNumber, setClassTotalNumber] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [newClassPopulation, setNewClassPopulation] = useState({
    class: "",
    numberOfStudents: "",
  });

  async function loadClassPopulationData() {
    try {
      const response = await axios.get("/class-population");
      setClassPopulation(response);
      setClassTotalNumber(response.data);
    } catch (error) {
      console.error("Error loading class data", error);
    }
  }

  useEffect(() => {
    loadClassPopulationData();
  }, []);

  function handleInputChanges(e) {
    const { name, value } = e.target;
    setNewClassPopulation((prev) => ({ ...prev, [name]: value }));
  }

  async function updateClassPopulation(e) {
    e.preventDefault();
    setFormSubmitted(true);

    if (!newClassPopulation.class || !newClassPopulation.numberOfStudents) return;

    try {
      const response = await axios.put(
        `/class-population/${newClassPopulation.class}`,
        { numberOfStudents: newClassPopulation.numberOfStudents }
      );

      setClassTotalNumber((prev) =>
        prev.map((cls) =>
          cls.class === newClassPopulation.class
            ? { ...cls, numberOfStudents: response.data.classPopulation.numberOfStudents }
            : cls
        )
      );

      setNewClassPopulation({ class: "", numberOfStudents: "" });
      setFormSubmitted(false);
      await loadClassPopulationData();
    } catch (error) {
      console.error("Error updating class", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      {displayMenu && (<NavMobile navItems={adminNavItems} subtitle="Admin Panel" />)}

      <div className="flex-1 lg:ml-80 p-2 sm:p-6 md:p-8">
        <Dir navItems={adminNavItems} />


        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2 my-6">
          <FaBook className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
          Academics Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Class Population --- */}
          <div className="col-span-2 bg-[#FFFFFF06] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold mb-4">Class Population</h2>

            <ul className="divide-y divide-gray-200 dark:divide-neutral-800">
              {classTotalNumber.map((course, index) => (
                <li
                  key={index}
                  className="flex justify-between py-3 hover:bg-cyan-600 rounded-lg px-2 transition"
                >
                  <span className="font-medium">{course.class}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {course.numberOfStudents} students
                  </span>
                </li>
              ))}
            </ul>

            <form
              onSubmit={updateClassPopulation}
              className="mt-6 flex flex-col md:flex-row gap-3 items-center"
            >
              <input
                type="text"
                name="class"
                value={newClassPopulation.class}
                onChange={handleInputChanges}
                placeholder="Enter class"
                className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                name="numberOfStudents"
                value={newClassPopulation.numberOfStudents}
                onChange={handleInputChanges}
                placeholder="No. of students"
                className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Update
              </button>
            </form>

            {formSubmitted &&
              (!newClassPopulation.class || !newClassPopulation.numberOfStudents) && (
                <p className="text-red-500 text-sm mt-2">
                  Please fill out both fields.
                </p>
              )}
          </div>

          {/* --- Exams and Schedule --- */}
          <div className="space-y-6">
            <div className="bg-[#FFFFFF06] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold mb-2">📆 Class Schedule</h2>
              <p className="text-gray-500 dark:text-gray-400">Coming soon...</p>
            </div>

            <div className="bg-[#FFFFFF06] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold mb-3">🧾 Exams & Results</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                Manage upcoming exams and results.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/ad-academics/exam-schedule"
                  className="hover:bg-blue-600 hover:text-white transition rounded-lg py-2 px-3 border border-gray-200 dark:border-neutral-700"
                >
                  Exam Schedule
                </Link>
                <Link
                  to="/ad-academics/upload-result"
                  className="hover:bg-blue-600 hover:text-white transition rounded-lg py-2 px-3 border border-gray-200 dark:border-neutral-700"
                >
                  Upload Results
                </Link>
                <Link
                  to="/ad-academics/view-results"
                  className="hover:bg-blue-600 hover:text-white transition rounded-lg py-2 px-3 border border-gray-200 dark:border-neutral-700"
                >
                  View Results
                </Link>
              </div>
            </div>

            <div className="bg-[#FFFFFF06] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold mb-2">🗓 Academic Calendar</h2>
              <p className="text-gray-500 dark:text-gray-400">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Academics;
