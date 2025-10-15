import React, { useContext, useEffect, useState } from "react";
import axios from "../Utils/axios.js";
import Nav2 from "../components/Nav2";
import { StaffNavItems } from "../data/navItems.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import NavMobile from "../components/MobileNav.jsx";
import { MenuContext } from "../Utils/MenuContext.jsx";
import { FiMenu } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

function StaffDashboard() {
  const [studentTotal, setStudentTotal] = useState(0);
  const [attendance, setAttendance] = useState({ present: 0, absent: 0 });
  const [assignments, setAssignments] = useState(0);
  const [recentActivities, setRecentActivities] = useState([
    "Attendance synced",
    "Assignments reviewed",
    "New student enrolled",
  ]);
  const { displayMenu, setDisplayMenu } = useContext(MenuContext);

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      fetchDataEss(user.class, user.staffId);
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  }

  async function fetchDataEss(userClass, userStaffId) {
    try {
      const [resStudents, resAtt, resCourses] = await Promise.all([
        axios.get(`/students/${userClass}`),
        axios.get(`/staff-attendance/${userStaffId}`),
        axios.get(`/assignments/${userClass}`),
      ]);

      setStudentTotal(resStudents.data.totalStudents || 0);
      setAttendance({
        present: resAtt.data.daysPresent || 0,
        absent: resAtt.data.daysAbsent || 0,
      });
      setAssignments(resCourses.data.totalTasks || 0);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  }

  useEffect(() => {
    loadProfile();

    //eslint-disable-next-line
  }, []);

  const totalDays = attendance.present + attendance.absent;
  const attendanceRate =
    totalDays > 0 ? ((attendance.present / totalDays) * 100).toFixed(1) : 0;

  // 📊 Bar Chart: Student Activity
  const barData = {
    labels: ["Students", "Assignments", "Days Present"],
    datasets: [
      {
        label: "Class Stats",
        data: [studentTotal, assignments, attendance.present],
        backgroundColor: ["#3b82f6", "#22c55e", "#a855f7"],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(255,255,255,0.05)" } },
    },
  };

  // 📈 Line Chart: Attendance trend
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Attendance Trend",
        data: [60, 70, 75, 80, 78, attendance.present || 85],
        fill: true,
        backgroundColor: "rgba(168,85,247,0.1)",
        borderColor: "#a855f7",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(255,255,255,0.05)" } },
    },
  };




  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#060e19] via-[#091427] to-[#020a12] text-slate-100 font-poppins">
      {/* Sidebar */}
      <Nav2 navItems={StaffNavItems} subtitle="Staff Analytics" />
      {displayMenu && (<NavMobile navItems={StaffNavItems} subtitle="Staff Analytics" />)}

      {/* Main */}
      <main className="lg:ml-80 w-full p-2 sm:p-6 md:p-8 overflow-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col items-start">
            <button
              onClick={() => setDisplayMenu(true)}
              className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-700 transition mb-6"
            >
              <FiMenu className="w-5 h-5 text-cyan-400" />
            </button>
            <h1 className="text-2xl font-bold">Staff Intelligence Panel</h1>
            <p className="text-slate-400 text-sm">
              Class insights • performance tracker
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            {[
              { title: "Students", value: studentTotal },
              { title: "Assignments", value: assignments },
              { title: "Attendance Rate", value: `${attendanceRate}%` },
              {
                title: "Days Present",
                value: attendance.present,
                accent: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg min-w-[110px] text-center border border-white/10 ${item.accent
                  ? "border-l-4 border-violet-400 bg-white/10"
                  : "bg-white/5"
                  }`}
              >
                <div className="text-xs text-slate-400">{item.title}</div>
                <div className="text-lg font-semibold text-white">
                  {item.value ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Main Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Class Overview */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Class Overview</h3>
              <small className="text-slate-400">Live data</small>
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-start">
              <Bar data={barData} options={barOptions} />

              {/* Utilization Meter */}
              <div className="flex flex-col items-center">
                <svg
                  viewBox="0 0 36 36"
                  className="w-40 h-40 transform -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2.8"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="url(#gradB)"
                    strokeWidth="2.8"
                    strokeDasharray={`${attendanceRate},100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradB" x1="0" x2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center mt-3 text-sm">
                  <div className="text-white font-semibold">
                    {attendanceRate}%
                  </div>
                  <div className="text-slate-400 text-xs">
                    Attendance Consistency
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Attendance Trend</h3>
              <small className="text-slate-400">Monthly</small>
            </div>
            <Line data={lineData} options={lineOptions} />
          </div>


          {/* Recent Activities */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Recent Activities</h3>
              <small className="text-slate-400">Class log</small>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-auto">
              {recentActivities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                  <div className="flex-1 text-slate-100">{a}</div>
                  <div className="text-xs text-slate-500">now</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Schools — staff analytics
        </footer>
      </main>
    </div>
  );
}

export default StaffDashboard;
