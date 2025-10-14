import React, { useContext, useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "../components/MobileNav.jsx";

function StudentExams() {
  const [exams, setExams] = useState([]);
  const [userClass, setUserClass] = useState("");
  const { displayMenu } = useContext(MenuContext);

  async function fetchProfile() {
    try {
      const res = await axios.get("/auth/profile");
      setUserClass(res.data.user.class);
    } catch (err) {
      console.error("Error fetching user profile", err);
    }
  }

  async function fetchExams(studentClass) {
    try {
      const response = await axios.get(
        `/exam-timetable/upcoming-exams/${studentClass}`
      );
      setExams(response.data || []);
    } catch (err) {
      console.error("Error fetching exam data", err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (userClass) fetchExams(userClass);
  }, [userClass]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 font-poppins">
      {/* Sidebar */}
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />

      {/* Main Section */}
      <main className="lg:ml-80 p-2 sm:p-6 md:p-8 w-full overflow-auto">
        <Dir navItems={studentNavItems} />
        {displayMenu && (<NavMobile navItems={studentNavItems} subtitle="Student Panel" />)}

        {/* Header */}
        <header className="my-8">
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Exams</h1>
          <p className="text-slate-400 text-sm mt-1">
            Stay informed about your upcoming exams and schedules.
          </p>
        </header>

        {/* Exam List */}
        {Array.isArray(exams) && exams.length > 0 ? (
          <section className="grid gap-4">
            {exams.map((exam) => (
              <article
                key={exam.id}
                className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-white">
                    {exam.subject}
                  </h2>
                  <span className="text-xs text-cyan-400 font-medium">
                    {exam.date}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-400">Time:</span> {exam.time}
                  </p>
                  <p>
                    <span className="text-slate-400">Venue:</span> {exam.venue}
                  </p>
                </div>

                <div className="mt-3 text-xs text-cyan-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  Class: {userClass}
                </div>
              </article>
            ))}
          </section>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-center">
            <img
              src="/empty.png"
              alt="No Exams"
              className="w-32 h-32 opacity-70 mb-4"
            />
            <h2 className="text-lg font-semibold text-white">
              No Upcoming Exams
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              You currently have no exams scheduled. Please check back later or
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

export default StudentExams;
