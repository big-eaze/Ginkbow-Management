import React, { useContext, useEffect, useState } from "react";
import axios from "../Utils/axios.js";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "../components/MobileNav.jsx";
import { FiMenu } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function StudentDashboard() {

  const { displayMenu, setDisplayMenu } = useContext(MenuContext);
  const [studentEssentials, setStudentEssentials] = useState({
    noOfCourses: 0,
    academicPerformance: 0,
    daysPresent: 0,
    daysAbsent: 0,
    upcomingExams: 0,
  });

  async function loadProfile() {
    try {
      const res = await axios.get("/auth/profile");
      const user = res.data.user;
      await loadStudentData(user.class, user.admissionNumber);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }

  async function loadStudentData(userClass, admissionNo) {
    try {
      const [courses, performance, attendance, exams] = await Promise.all([
        axios.get(`/courses/${userClass}`),
        axios.get(`/results/${admissionNo}`),
        axios.get(`/student-attendance/${admissionNo}`),
        axios.get(`/exam-timetable/upcoming-exams/${userClass}`),
      ]);

      setStudentEssentials({
        noOfCourses: courses.data.numberOfCourses || 0,
        academicPerformance: performance.data.academicPerformance || 0,
        daysPresent: attendance.data.daysPresent || 0,
        daysAbsent: attendance.data.daysAbsent || 0,
        upcomingExams: exams.data.totalUpcomingExams || 0,
      });
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const { noOfCourses, academicPerformance, daysPresent, daysAbsent, upcomingExams } =
    studentEssentials;

  // Attendance % progress
  const attendanceRate = daysPresent + daysAbsent
    ? Math.round((daysPresent / (daysPresent + daysAbsent)) * 100)
    : 0;

  // Line Chart for attendance trend
  const lineData = {
    labels: ["Days Present", "Days Absent"],
    datasets: [
      {
        label: "Attendance Record",
        data: [daysPresent, daysAbsent],
        fill: true,
        backgroundColor: "rgba(56,189,248,0.1)",
        borderColor: "#06b6d4",
        tension: 0.4,
        pointBackgroundColor: "#06b6d4",
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

  const quickStats = [
    { title: "Courses Enrolled", value: noOfCourses },
    { title: "Performance", value: `${academicPerformance}` },
    { title: "Upcoming Exams", value: upcomingExams },
    { title: "Attendance", value: `${attendanceRate}%` },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 font-poppins">
      {/* Sidebar */}
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      {displayMenu && (<NavMobile navItems={studentNavItems} subtitle="Student Panel" />)}
      {/* Main */}
      <main className="lg:ml-80 p-6 w-full min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-col items-start">
            <button
              onClick={() => setDisplayMenu(true)}
              className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-700 transition mb-6"
            >
              <FiMenu className="w-5 h-5 text-cyan-400" />
            </button>
            <h1 className="text-2xl font-bold">Student Analytics</h1>
            <p className="text-slate-400 text-sm">Aurora learning matrix</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {quickStats.map((stat, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg min-w-[110px] text-center border border-white/10 bg-white/5"
              >
                <div className="text-xs text-slate-400">{stat.title}</div>
                <div className="text-lg font-semibold text-white">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Layout grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Attendance Chart */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Attendance Overview</h3>
              <small className="text-slate-400">Current term</small>
            </div>
            <Line data={lineData} options={lineOptions} />

            {/* Circular progress */}
            <div className="flex justify-center items-start mt-6">
              <svg viewBox="0 0 36 36" className="w-36 h-36 transform -rotate-90">
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
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center mt-12">
                <div className="text-white font-semibold text-lg">
                  {attendanceRate}%
                </div>
                <div className="text-slate-400 text-xs">Attendance</div>
              </div>
            </div>
          </div>

          {/* Quick Performance Summary */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Performance Summary</h3>
              <small className="text-slate-400">Snapshot</small>
            </div>
            <div className="divide-y divide-white/10">
              {[
                ["Total Courses", noOfCourses],
                ["Academic Performance", `${academicPerformance}`],
                ["Days Present", daysPresent],
                ["Days Absent", daysAbsent],
                ["Upcoming Exams", upcomingExams],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 text-sm"
                >
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="col-span-1 lg:col-span-2 bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <small className="text-slate-400">Live updates</small>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-auto">
              {[
                "Logged in successfully",
                "Viewed new assignment",
                "Checked attendance record",
                "Accessed exam timetable",
              ].map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  <div className="flex-1 text-slate-100">{a}</div>
                  <div className="text-xs text-slate-500">now</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Students Portal — powered by Insight Engine
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;
