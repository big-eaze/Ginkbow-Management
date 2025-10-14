import React, { useState, useEffect, useContext } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import axios from "../Utils/axios.js";
import { StaffNavItems } from "../data/navItems";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "../components/MobileNav.jsx";

function StaffAttendance() {
  const [attendanceStatus, setAttendanceStatus] = useState("Not Marked");
  const { displayMenu } = useContext(MenuContext);
  const [userStaffId, setUserStaffId] = useState("");
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalData, setModalData] = useState({ isOpen: false, status: "" });

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      setUserStaffId(response.data.user.staffId);
    } catch (err) {
      console.error("Error fetching profile data", err);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function markAttendance(status) {
    setModalData({ isOpen: true, status });
  }

  async function confirmStatusChange() {
    try {
      await axios.post(`/staff-attendance/${userStaffId}`, {
        date: selectedDate,
        status: modalData.status,
      });
      setAttendanceStatus(modalData.status);
      setModalData({ isOpen: false, status: "" });
    } catch (err) {
      console.error("Error confirming status change", err);
    }
  }

  function closeModal() {
    setModalData({ isOpen: false, status: "" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-gray-100">
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      {displayMenu && <NavMobile navItems={StaffNavItems} subtitle="Admin Panel" />}
      <div className="flex flex-col lg:ml-80 p-2 sm:p-6 md:p-8 gap-6">
        <Dir navItems={StaffNavItems} />

        <div className="flex-1 bg-[#FFFFFF06] p-6 rounded-2xl shadow-md border border-gray-800">
          <h1 className="text-2xl font-semibold mb-6 text-white">
            My Attendance
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
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
              readOnly
              className="bg-[#FFFFFF06] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 outline-none"
            />
          </div>

          <div className="text-lg mb-8">
            <span className="text-gray-400">Attendance Status: </span>
            <span
              className={`font-semibold ${attendanceStatus === "Present"
                ? "text-green-400"
                : attendanceStatus === "Absent"
                  ? "text-red-400"
                  : "text-yellow-400"
                }`}
            >
              {attendanceStatus}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              disabled={attendanceStatus !== "Not Marked"}
              onClick={() => markAttendance("Present")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${attendanceStatus === "Present"
                ? "bg-green-600 text-white"
                : "bg-green-700 hover:bg-green-600 text-white"
                } disabled:opacity-50`}
            >
              Mark Present
            </button>

            <button
              disabled={attendanceStatus !== "Not Marked"}
              onClick={() => markAttendance("Absent")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${attendanceStatus === "Absent"
                ? "bg-red-600 text-white"
                : "bg-red-700 hover:bg-red-600 text-white"
                } disabled:opacity-50`}
            >
              Mark Absent
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalData.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#121212] border border-gray-700 rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-white">
              Confirm Status Submission
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to mark as{" "}
              <span className="font-bold text-blue-400">
                {modalData.status}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmStatusChange}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-white transition"
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

export default StaffAttendance;
