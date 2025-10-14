import React, { useContext, useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { StaffNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import NavMobile from "../components/MobileNav.jsx";
import { MenuContext } from "../Utils/MenuContext.jsx";

function StaffCourseWork() {
  const [assignments, setAssignments] = useState([]);
  const { displayMenu } = useContext(MenuContext);
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
  }, []);

  async function fetchAssignments(theClass) {
    try {
      const response = await axios.get(`/assignments/${theClass}`);
      setAssignments(response.data.tasks);
    } catch (err) {
      console.error("error fetching assignments", err);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  async function handleAddAssignment(e) {
    e.preventDefault();
    setModal(true);
  }

  async function confirmAssignmentSubmission() {
    try {
      if (
        newAssignment.title &&
        newAssignment.description &&
        newAssignment.dueDate
      ) {
        await axios.post(`/assignments/${userClass}`, newAssignment);
        await fetchAssignments(userClass);
        setModal(false);
        setNewAssignment({ title: "", description: "", dueDate: "" });
      }
    } catch (err) {
      console.error("error sending assignment", err);
    }
  }

  function closeModal() {
    setModal(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-gray-100">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      {displayMenu && <NavMobile navItems={StaffNavItems} subtitle="Staff Panel" />}
      <div className="flex flex-col lg:ml-80 p-2 sm:p-6 md:p-8 gap-6">
        <Dir navItems={StaffNavItems} />

        {/* Main Container */}
        <div className="flex-1 bg-[#FFFFFF06] border border-gray-800 rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-semibold text-white mb-8">
            Course Work
          </h1>

          {/* Assignment Form */}
          <form
            className="space-y-5 bg-[#FFFFFF06] border border-gray-800 p-6 rounded-xl mb-10"
            onSubmit={handleAddAssignment}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Assign a New Task
            </h2>

            <div>
              <label
                htmlFor="title"
                className="block text-sm text-gray-400 mb-2"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newAssignment.title}
                onChange={handleInputChange}
                required
                className="w-full bg-[#FFFFFF06] border border-gray-700 text-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm text-gray-400 mb-2"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={newAssignment.description}
                onChange={handleInputChange}
                required
                className="w-full bg-[#FFFFFF06] border border-gray-700 text-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-cyan-400 outline-none"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm text-gray-400 mb-2"
              >
                Due Date:
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={newAssignment.dueDate}
                onChange={handleInputChange}
                required
                className="bg-[#FFFFFF06] border border-gray-700 text-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-2.5 rounded-lg transition duration-200"
            >
              Send Assignment
            </button>
          </form>

          {/* Assignment List */}
          <div className="bg-[#FFFFFF06] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Assigned Tasks
            </h2>
            {assignments.length === 0 ? (
              <p className="text-gray-400">No assignments added yet.</p>
            ) : (
              <ul className="space-y-4">
                {assignments.map((assignment, idx) => (
                  <li
                    key={idx}
                    className="p-4 bg-[#FFFFFF06] border border-gray-700 rounded-lg hover:border-cyan-400 transition duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-400 mt-1">
                      {assignment.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Due Date:{" "}
                      <span className="text-blue-400">
                        {assignment.dueDate}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#FFFFFF06] backdrop-blur-md border border-gray-700 rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-xl font-semibold mb-3 text-white">
              Confirm Action
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to send this{" "}
              <span className="font-bold text-blue-400">task</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-cyan-400 hover:bg-cyan-500 px-5 py-2 rounded-lg text-white transition"
                onClick={confirmAssignmentSubmission}
              >
                Confirm
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition"
                onClick={closeModal}
              >
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
