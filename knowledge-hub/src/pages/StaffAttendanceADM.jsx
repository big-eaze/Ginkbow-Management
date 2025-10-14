import React, { useEffect, useState, useContext } from "react";
import axios from "../Utils/axios.js";
import { MenuContext } from "../Utils/MenuContext.jsx";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { adminNavItems } from "../data/navItems";
import NavMobile from "../components/MobileNav.jsx";

function StaffAttendanceADM() {
  const { staffAtt, setStaffAtt, displayMenu } = useContext(MenuContext);
  const [selectedDate] = useState("2025-06-25");
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  useEffect(() => {
    const attendanceForDate = staffAtt?.find((entry) => entry.date === selectedDate);
    if (attendanceForDate) {
      setFilteredAttendance(attendanceForDate.staffStatus || []);
    } else {
      setFilteredAttendance([]);
    }
  }, [selectedDate, staffAtt]);

  useEffect(() => {
    async function loadStaffAttendance() {
      try {
        const response = await axios.get("/staff-attendance?expand=staff");
        setStaffAtt(response.data);
      } catch (err) {
        console.error("error loading staff attendance", err);
      }
    }
    loadStaffAttendance();
  }, [setStaffAtt]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 font-poppins">
      {/* Sidebar */}
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      {displayMenu && <NavMobile navItems={adminNavItems} subtitle="Admin Panel" />}

      {/* Main */}
      <main className="flex-1 lg:ml-80 p-2 sm:p-6 md:p-8 overflow-auto">
        <Dir navItems={adminNavItems} />
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center my-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Staff Attendance
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Attendance overview • Smart daily record
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-4 md:mt-0">
            <label htmlFor="attendance-date" className="text-slate-300 text-sm">
              Selected Date
            </label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              readOnly
              className="bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg backdrop-blur-md outline-none"
            />
          </div>
        </header>

        {/* Attendance Table */}
        <section className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Attendance Sheet</h2>
            <span className="text-slate-400 text-sm">
              Total: {filteredAttendance.length}
            </span>
          </div>

          {filteredAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10 text-left">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((staff, idx) => (
                    <tr
                      key={staff.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                    >
                      <td className="py-3 px-4 text-slate-300">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-white">
                        {staff.staffDetails.name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${staff.status.toLowerCase() === "present"
                            ? "bg-green-400/20 text-green-300 border border-green-500/40"
                            : staff.status.toLowerCase() === "absent"
                              ? "bg-red-400/20 text-red-300 border border-red-500/40"
                              : "bg-yellow-400/20 text-yellow-300 border border-yellow-500/40"
                            }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">📋</span>
              </div>
              <p>No attendance data available for this date.</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Schools — attendance module
        </footer>
      </main>
    </div>
  );
}

export default StaffAttendanceADM;
