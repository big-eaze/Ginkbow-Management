import React, { useContext, useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "../components/MobileNav.jsx";

function StudentResults() {
  const [userAdmissionNumber, setUserAdmissionNumber] = useState("");
  const [resultsData, setResultsData] = useState([]);
  const { displayMenu } = useContext(MenuContext);

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      const admissionNumber = user.admissionNumber;
      setUserAdmissionNumber(admissionNumber);
      fetchResults(admissionNumber);
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }

  async function fetchResults(studentAdm) {
    try {
      const response = await axios.get(`/results/${studentAdm}`);
      const data = response.data;
      setResultsData(data.subjects || []);
    } catch (err) {
      console.error("Error fetching result:", err);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 font-poppins">
      {/* Sidebar */}
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      {displayMenu && (<NavMobile navItems={studentNavItems} subtitle="Student Panel" />)}

      {/* Main Section */}
      <main className="lg:ml-80 p-2 sm:p-6 md:p-8 w-full overflow-auto">
        <Dir navItems={studentNavItems} />

        {/* Header */}
        <header className="my-8">
          <h1 className="text-3xl font-bold tracking-tight">View Results</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review your academic performance across subjects.
          </p>
        </header>

        {/* Results Table */}
        {Array.isArray(resultsData) && resultsData.length > 0 ? (
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-white/10 text-slate-300 text-left uppercase text-xs tracking-wide">
                  <th className="py-3 px-4 rounded-tl-2xl">Subject</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 rounded-tr-2xl">Grade</th>
                </tr>
              </thead>
              <tbody>
                {resultsData.map((result, index) => (
                  <tr
                    key={index}
                    className="border-t border-white/10 hover:bg-white/10 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {result.name}
                    </td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">
                      {result.score}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${result.grade === "A"
                        ? "text-emerald-400"
                        : result.grade === "B"
                          ? "text-cyan-400"
                          : result.grade === "C"
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                    >
                      {result.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Fallback when no results
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-center">
            <img
              src="/empty.png"
              alt="No Results"
              className="w-32 h-32 opacity-70 mb-4"
            />
            <h2 className="text-lg font-semibold text-white">
              No Results Available
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              You currently have no results published. Please check back later or
              contact your class teacher for updates.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Schools — Student Portal
        </footer>
      </main>
    </div>
  );
}

export default StudentResults;
