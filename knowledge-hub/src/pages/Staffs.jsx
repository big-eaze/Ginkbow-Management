import React, { useEffect, useState, useContext } from "react";
import axios from "../Utils/axios.js";
import Dir from "../components/Dir";
import { Link } from "react-router-dom";
import Nav2 from "../components/Nav2";
import { MenuContext } from "../Utils/MenuContext.jsx";
import { adminNavItems } from "../data/navItems";
import { FaUser } from "react-icons/fa";
import NavMobile from "../components/MobileNav.jsx";

function Staffs() {
  const { setStaffData, displayMenu } = useContext(MenuContext);

  const [errors, setErrors] = useState({});
  const [staff, setStaff] = useState(false);
  const [staffDetails, setStaffDetails] = useState([]);
  const [newStaffDetails, setNewStaffDetails] = useState({
    staffId: "",
    name: "",
    subject: "",
    class: "",
    email: "",
    phone: "",
    gender: "",
  });

  async function loadStaffData() {
    try {
      const responseStaff = await axios.get("/staff");
      setStaffData(responseStaff.data);
      setStaffDetails(responseStaff.data.staffMembers);
    } catch (err) {
      console.error("error loading staff data", err);
    }
  }

  useEffect(() => {
    loadStaffData();
  }, []);

  function validationForm(data) {
    const newError = {};
    if (!data.staffId.trim() || data.staffId.length !== 8)
      newError.staffId = "Staff ID must be 8 characters";
    if (!data.name.trim()) newError.name = "Name is required!";
    if (!data.subject.trim()) newError.subject = "Subject is required!";
    if (!data.class.trim()) newError.class = "Class is required!";
    if (!data.gender) newError.gender = "Gender is required!";
    if (!data.phone) newError.phone = "Phone number is required!";
    return newError;
  }

  async function addStaffDetails(e) {
    e.preventDefault();
    const validationError = validationForm(newStaffDetails);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    try {
      const response = await axios.post("/staff", newStaffDetails);
      setStaffDetails((prev) => [...prev, response.data.staff]);
      await loadStaffData();
      setNewStaffDetails({
        staffId: "",
        name: "",
        subject: "",
        class: "",
        email: "",
        phone: "",
        gender: "",
      });
      setErrors({});
      alert("New staff added successfully!");
    } catch (e) {
      console.error("error adding staff", e.response?.data || e.message);
    }
  }

  const rowsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = (staffDetails || []).slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(staffDetails.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  async function deleteStaff(staffId) {
    try {
      await axios.delete(`/staff/${staffId}`);
      await loadStaffData();
    } catch (err) {
      console.error("error deleting staff data", err);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewStaffDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col md:flex-row">
      {/* Desktop + Mobile Navigation */}
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      {displayMenu && <NavMobile navItems={adminNavItems} subtitle="Admin Panel" />}

      {/* Main Section */}
      <div className="flex-1 flex flex-col md:ml-72 p-2 sm:p-6 md:p-8">
        <Dir navItems={adminNavItems} />

        {/* Header + Toggle Buttons */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <FaUser className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            Staff Management
          </h1>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setStaff(false)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base transition ${!staff
                  ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300"
                  : "hover:bg-white/10 border border-white/10 text-slate-300"
                }`}
            >
              All Staffs
            </button>
            <button
              onClick={() => setStaff(true)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base transition ${staff
                  ? "bg-indigo-500/20 border border-indigo-400/50 text-indigo-300"
                  : "hover:bg-white/10 border border-white/10 text-slate-300"
                }`}
            >
              Add Staff
            </button>
          </div>
        </header>

        {/* ========================= All Staffs Table ======================== */}
        {!staff ? (
          <div className="bg-[#FFFFFF06] backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-800 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold">Staff List</h2>
              <div className="flex justify-center items-center gap-3 text-sm sm:text-base">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40 hover:bg-gray-700"
                >
                  ←
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white/10 rounded-lg disabled:opacity-40 hover:bg-gray-700"
                >
                  →
                </button>
              </div>
            </div>

            <table className="w-full min-w-[800px] text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 uppercase">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((data, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-4">{data.name}</td>
                      <td className="py-3 px-4">{data.subject}</td>
                      <td className="py-3 px-4">{data.class}</td>
                      <td className="py-3 px-4">{data.email}</td>
                      <td className="py-3 px-4">{data.phone}</td>
                      <td className="py-3 px-4">{data.gender}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteStaff(data.staffId)}
                          className="px-3 py-1 text-sm text-red-400 border border-red-400/40 rounded-lg hover:bg-red-400/10 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400 italic"
                    >
                      No staff data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ========================= Add Staff Form ======================== */
          <form
            onSubmit={addStaffDetails}
            className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-800 space-y-5 w-full max-w-md mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 text-center">
              Add New Staff
            </h2>

            {[
              { name: "staffId", placeholder: "Staff ID (8 characters)" },
              { name: "name", placeholder: "Full Name" },
              { name: "subject", placeholder: "Subject" },
              { name: "class", placeholder: "Class" },
              { name: "email", placeholder: "Email" },
              { name: "phone", placeholder: "Phone" },
            ].map(({ name, placeholder }) => (
              <div key={name}>
                <input
                  type={name === "email" ? "email" : "text"}
                  name={name}
                  placeholder={placeholder}
                  value={newStaffDetails[name]}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/60 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}

            <select
              name="gender"
              value={newStaffDetails.gender}
              onChange={handleInputChange}
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
              Add Staff
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Staffs;
