import React, { useContext, useEffect, useState } from "react";
import axios from "../Utils/axios.js";
import { MenuContext } from "../Utils/MenuContext.jsx";
import Nav2 from "../components/Nav2";
import NavMobile from "../components/MobileNav.jsx";
import Dir from "../components/Dir";
import { adminNavItems } from "../data/navItems";
import { FaUser } from "react-icons/fa";

export default function StudentsAdmin() {
  const { setStudentsData, displayMenu } = useContext(MenuContext);
  const [studDetails, setStudDetails] = useState([]);
  const [errors, setErrors] = useState({});
  const [student, setStudent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const [newStudentDetails, setNewStudentDetails] = useState({
    admissionNumber: "",
    name: "",
    class: "",
    gender: "",
    age: "",
    parentPhone: "",
  });

  useEffect(() => {
    loadStudentData();
  }, []);

  async function loadStudentData() {
    try {
      const res = await axios.get("/students");
      setStudentsData(res.data);
      setStudDetails(res.data.students);
    } catch (err) {
      console.error("Error loading students", err);
    }
  }

  function handleInputChanges(e) {
    const { name, value } = e.target;
    setNewStudentDetails((prev) => ({ ...prev, [name]: value }));
  }

  async function addStudentData(e) {
    e.preventDefault();
    const validationError = validationForm(newStudentDetails);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }

    try {
      const res = await axios.post("/students", {
        ...newStudentDetails,
        age: Number(newStudentDetails.age),
      });
      setStudDetails((prev) => [...prev, res.data.student]);
      setNewStudentDetails({
        admissionNumber: "",
        name: "",
        class: "",
        gender: "",
        age: "",
        parentPhone: "",
      });
      setErrors({});
      loadStudentData();
    } catch (err) {
      console.error("Error adding student", err);
    }
  }

  function validationForm(data) {
    const newError = {};
    if (!data.admissionNumber.trim()) newError.admissionNumber = "Admission number is required!";
    if (!data.name.trim()) newError.name = "Name is required!";
    if (!data.class.trim()) newError.class = "Class is required!";
    if (!data.age || isNaN(data.age)) newError.age = "Valid age required!";
    if (!data.gender) newError.gender = "Gender is required!";
    if (!data.parentPhone) newError.parentPhone = "Parent phone required!";
    return newError;
  }

  async function deleteStudent(admissionNo) {
    try {
      await axios.delete(`/students/${admissionNo}`);
      loadStudentData();
    } catch (err) {
      console.error("Error deleting student", err);
    }
  }

  const totalPages = Math.ceil(studDetails.length / rowsPerPage);
  const currentRows = studDetails.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col md:flex-row">
      {/* Desktop + Mobile Navigation */}
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      {displayMenu && (<NavMobile navItems={adminNavItems} subtitle="Admin Panel" />)}

      <div className="flex-1 flex flex-col md:ml-72 p-2 sm:p-6 md:p-8">

        <Dir navItems={adminNavItems} />

        {/* Header + Toggle Buttons */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <FaUser className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            Student Management
          </h1>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setStudent(false)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base transition ${!student
                ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300"
                : "hover:bg-white/10 border border-white/10 text-slate-300"
                }`}
            >
              All Students
            </button>
            <button
              onClick={() => setStudent(true)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base transition ${student
                ? "bg-indigo-500/20 border border-indigo-400/50 text-indigo-300"
                : "hover:bg-white/10 border border-white/10 text-slate-300"
                }`}
            >
              Add Student
            </button>
          </div>
        </header>

        {/* Table View */}
        {!student ? (
          <div className="bg-[#FFFFFF06] backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-800 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold">Student List</h2>
              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 text-sm sm:text-base">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40 hover:bg-gray-700"
                >
                  ←
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40 hover:bg-gray-700"
                >
                  →
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10 uppercase">
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4">Parent Contact</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((data, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-4">{data.admissionNumber}</td>
                      <td className="py-3 px-4">{data.name}</td>
                      <td className="py-3 px-4">{data.class}</td>
                      <td className="py-3 px-4">{data.gender}</td>
                      <td className="py-3 px-4">{data.age}</td>
                      <td className="py-3 px-4">{data.parentPhone}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteStudent(data.admissionNumber)}
                          className="px-3 py-1 text-sm text-red-400 border border-red-400/40 rounded-lg hover:bg-red-400/10 transition"
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
        ) : (
          /* Form View */
          <form
            onSubmit={addStudentData}
            className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-800 space-y-5 w-full max-w-md mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400">Add New Student</h2>

            {["admissionNumber", "name", "class", "age", "parentPhone"].map((field) => (
              <div key={field}>
                <input
                  type={field === "age" ? "number" : "text"}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  name={field}
                  value={newStudentDetails[field]}
                  onChange={handleInputChanges}
                  className="w-full bg-gray-800/60 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <select
              name="gender"
              value={newStudentDetails.gender}
              onChange={handleInputChanges}
              className="w-full p-3 bg-[#101a2a] rounded-lg border border-[#1e2b3c] text-gray-200 focus:ring-2 focus:ring-cyan-400 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-medium transition"
            >
              Add Student
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
