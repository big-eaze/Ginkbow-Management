import React, { useContext, useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import getTimeAgo from "../Utils/getTimeAgo.js";
import { MenuContext } from "../Utils/MenuContext.jsx";
import NavMobile from "../components/MobileNav.jsx";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const { displayMenu } = useContext(MenuContext);

  async function fetchAnnouncements() {
    try {
      const response = await axios.get("/announcements");
      const announcement = Array.isArray(response.data)
        ? response.data
        : [response.data];
      const studentsOnly = announcement.filter(
        (ann) => ann.receiver === "students"
      );
      setAnnouncements(studentsOnly);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] text-slate-100 font-poppins">
      {/* Sidebar */}
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      {displayMenu && (<NavMobile navItems={studentNavItems} subtitle="Student Panel" />)}

      {/* Main Content */}
      <main className="lg:ml-80 p-2 sm:p-6 md:p-8 w-full overflow-auto">
        <Dir navItems={studentNavItems} />
        {displayMenu && (<NavMobile navItems={studentNavItems} subtitle="Admin Panel" />)}
        <header className="my-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Student Announcements
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Stay informed with recent updates, news, and activities.
          </p>
        </header>

        {/* Announcements List */}
        <section className="grid gap-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-white">
                    {announcement.title}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {getTimeAgo(announcement.createdAt)}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {announcement.content}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-cyan-400">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  For students only
                </div>
              </article>
            ))
          ) : (
            <div className="text-center text-slate-500 py-12 border border-dashed border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              No announcements available yet.
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Schools — Student Portal
        </footer>
      </main>
    </div>
  );
}

export default StudentAnnouncements;
