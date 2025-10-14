import React, { useContext, useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import axios from "../Utils/axios.js";
import { StaffNavItems } from "../data/navItems";
import getTimeAgo from "../Utils/getTimeAgo.js";
import NavMobile from "../components/MobileNav.jsx";
import { MenuContext } from "../Utils/MenuContext.jsx";

function StaffAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const { displayMenu } = useContext(MenuContext);
  async function fetchAnnouncements() {
    try {
      const response = await axios.get("/announcements");
      const announc = response.data;
      const staffAnnouncements = announc.filter(
        (ann) => ann.receiver === "staff"
      );
      setAnnouncements(staffAnnouncements);
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
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      {displayMenu && <NavMobile navItems={StaffNavItems} subtitle="Admin Panel" />}
      {/* Main */}
      <main className="lg:ml-80 p-2 sm:p-6 md:p-8 w-full">
        <Dir navItems={StaffNavItems} />
        <header className="my-8">
          <h1 className="text-2xl font-bold mb-1">Staff Announcements</h1>
          <p className="text-slate-400 text-sm">
            Internal memos • auto-synced
          </p>
        </header>

        <section className="space-y-4">
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-slate-400 mt-20">
              <p className="text-lg">No announcements available yet.</p>
              <span className="text-xs opacity-70 mt-2">
                Stay tuned for updates.
              </span>
            </div>
          ) : (
            announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {announcement.title}
                  </h2>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {getTimeAgo(announcement.createdAt)}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mt-1">
                  {announcement.content}
                </p>
              </article>
            ))
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Aurora Schools — staff communications
        </footer>
      </main>
    </div>
  );
}

export default StaffAnnouncement;
