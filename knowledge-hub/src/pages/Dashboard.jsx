import React, { useContext, useEffect, useState } from "react";
import axios from "../Utils/axios.js";
import Nav2 from "../components/Nav2";
import { adminNavItems } from "../data/navItems.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MenuContext } from "../Utils/MenuContext.jsx";
import { FiMenu } from "react-icons/fi";
import NavMobile from "../components/MobileNav.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function Dashboard() {
  const [overallDetails, setOverallDetails] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalResultsUploaded: 0,
  });
  const [recentActivities, setRecentActivities] = useState([
    "System warmed up",
    "Daily backup completed",
    "No suspicious activity detected",
  ]);
  const { displayMenu, setDisplayMenu } = useContext(MenuContext);

  async function fetchData() {
    try {
      const [students, staff, results] = await Promise.all([
        axios.get("/students"),
        axios.get("/staff"),
        axios.get("/results?expand=student"),
      ]);
      setOverallDetails({
        totalStudents: students.data.totalStudents || 0,
        totalStaff: staff.data.totalStaff || 0,
        totalResultsUploaded: results.data.totalResults || 0,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const { totalStudents, totalStaff, totalResultsUploaded } = overallDetails;
  const ratio =
    totalStaff > 0 ? (totalStudents / totalStaff).toFixed(1) : "—";
  const utilizationPct = (() => {
    const total = totalStudents + totalStaff;
    if (!total) return 0;
    return Math.max(
      6,
      Math.min(100, Math.round((totalStudents / total) * 100))
    );
  })();

  const barData = {
    labels: ["Students", "Staff", "Results"],
    datasets: [
      {
        label: "Count",
        data: [totalStudents, totalStaff, totalResultsUploaded],
        backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b"],
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

  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Enrollment Trend",
        data: [120, 140, 165, 190, 220, totalStudents || 240],
        fill: true,
        backgroundColor: "rgba(96,165,250,0.1)",
        borderColor: "#3b82f6",
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
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 font-poppins">
      {/* Sidebar */}

      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      {displayMenu && (<NavMobile navItems={adminNavItems} subtitle="Admin Panel" />)}


      {/* Main */}
      <main className="lg:ml-80 w-full p-2 sm:p-6 md:p-8 overflow-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

          <div className="flex flex-col items-start">
            <button
              onClick={() => setDisplayMenu(true)}
              className="p-2 lg:hidden  rounded-lg bg-gray-800/70 hover:bg-gray-700 transition mb-6"
            >
              <FiMenu className="w-5 h-5 text-cyan-400" />
            </button>
            <h1 className="text-2xl font-bold">School Intelligence</h1>
            <p className="text-slate-400 text-sm">
              Admin Analytics • live sync
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { title: "Active Students", value: totalStudents },
              { title: "Staff", value: totalStaff },
              { title: "Results", value: totalResultsUploaded },
              { title: "Ratio", value: `${ratio}:1`, accent: true },
            ].map((item, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg min-w-[110px] text-center border border-white/10 ${item.accent
                  ? "border-l-4 border-cyan-400 bg-white/10"
                  : "bg-white/5"
                  }`}
              >
                <div className="text-xs text-slate-400">{item.title}</div>
                <div className="text-lg font-semibold text-white">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1 */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Population Snapshot</h3>
              <small className="text-slate-400">Updated live</small>
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-start">
              <Bar data={barData} options={barOptions} />

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
                    stroke="url(#gradA)"
                    strokeWidth="2.8"
                    strokeDasharray={`${utilizationPct},100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradA" x1="0" x2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center mt-3 text-sm">
                  <div className="text-white font-semibold">
                    {utilizationPct}%
                  </div>
                  <div className="text-slate-400 text-xs">
                    Student utilization
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Enrollment Trend</h3>
              <small className="text-slate-400">Monthly</small>
            </div>
            <Line data={lineData} options={lineOptions} />
          </div>

          {/* System Summary */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">System Summary</h3>
              <small className="text-slate-400">Quick metrics</small>
            </div>
            <div className="divide-y divide-white/10">
              {[
                ["Students", totalStudents],
                ["Staff", totalStaff],
                ["Results Uploaded", totalResultsUploaded],
                ["Avg Class Size", Math.max(20, Math.round(totalStudents / 10))],
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

          {/* Activities */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Recent Activities</h3>
              <small className="text-slate-400">System log</small>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-auto">
              {recentActivities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                  <div className="flex-1 text-slate-100">{a}</div>
                  <div className="text-xs text-slate-500">now</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Schools — analytics engine
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
