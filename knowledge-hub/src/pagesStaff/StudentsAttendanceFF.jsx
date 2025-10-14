import React, { useContext, useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import axios from "../Utils/axios.js";
import { StaffNavItems } from "../data/navItems";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "../components/MobileNav.jsx";

function StudentsAttendanceFF() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { displayMenu } = useContext(MenuContext);

  const [students, setStudents] = useState([]);
  const [modalData, setModalData] = useState({
    isOpen: false,
    student: null,
    status: "",
  });

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      await fetchStudents(user.class);
    } catch (err) {
      console.error("error fetching profile data", err);
    }
  }

  async function fetchStudents(userClass) {
    try {
      const response = await axios.get(`/students/${userClass}`);
      const students = response.data.students;
      setStudents(
        students.map((student, idx) => ({
          id: idx + 1,
          admissionNumber: student.admissionNumber,
          name: student.name,
          status: "not marked",
        }))
      );
    } catch (err) {
      console.error("error fetching students data", err);
    }
  }

  useEffect(() => {
    loadProfile();
    //eslint-disable-next-line
  }, []);

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

  function handleStatusChange(id, status) {
    const student = students.find((student) => student.id === id);
    setModalData({ isOpen: true, student, status });
  }

  async function confirmStatusChange() {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === modalData.student.id
          ? { ...student, status: modalData.status }
          : student
      )
    );

    await addStudentAttendance();
    setModalData({ isOpen: false, student: null, status: "" });
  }

  const closeModal = () => {
    setModalData({ isOpen: false, student: null, status: "" });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-gray-100">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      {displayMenu && <NavMobile navItems={StaffNavItems} subtitle="Staff Panel" />}
      <div className="flex flex-col lg:ml-80 p-2 sm:p-6 md:p-8 gap-6">
        <Dir navItems={StaffNavItems} />

        <div className="flex-1 bg-[#FFFFFF06] border border-gray-800 rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">
            Students Attendance
          </h1>

          {/* Date Picker */}
          <div className="flex items-center gap-4 mb-8">
            <label
              htmlFor="attendance-date"
              className="text-gray-300 font-medium"
            >
              Date:
            </label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={handleDateChange}
              readOnly
              className="bg-[#FFFFFF06] border border-gray-700 text-gray-300 rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#081022] border-b border-gray-800">
                <tr className="text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-[#081022] transition-colors border-b border-gray-800"
                  >
                    <td className="p-3">{student.id}</td>
                    <td className="p-3">{student.name}</td>
                    <td
                      className={`p-3 capitalize ${student.status === "present"
                        ? "text-green-400"
                        : student.status === "absent"
                          ? "text-red-400"
                          : "text-yellow-400"
                        }`}
                    >
                      {student.status}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          disabled={student.status !== "not marked"}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${student.status === "present"
                            ? "bg-green-600 text-white"
                            : "bg-green-700 hover:bg-green-600 text-white"
                            } disabled:opacity-50`}
                          onClick={() =>
                            handleStatusChange(student.id, "present")
                          }
                        >
                          Present
                        </button>
                        <button
                          disabled={student.status !== "not marked"}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${student.status === "absent"
                            ? "bg-red-600 text-white"
                            : "bg-red-700 hover:bg-red-600 text-white"
                            } disabled:opacity-50`}
                          onClick={() =>
                            handleStatusChange(student.id, "absent")
                          }
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#FFFFFF06] border backdrop-blur-lg border-gray-700 rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-xl font-semibold mb-3 text-white">
              Confirm Status Change
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to mark{" "}
              <span className="font-bold text-blue-400">
                {modalData.student.name}
              </span>{" "}
              as{" "}
              <span className="font-bold text-blue-400">
                {modalData.status}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmStatusChange}
                className="bg-cyan-400 hover:bg-cyan-500 px-5 py-2 rounded-lg text-white transition"
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-white transition"
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

export default StudentsAttendanceFF;
