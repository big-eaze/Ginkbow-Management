import { FaTimes, FaUserShield, FaUserGraduate } from "react-icons/fa";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuContext } from "../Utils/MenuContext";
import axios from "../Utils/axios.js";

export default function Nav2({ navItems, subtitle }) {
  const location = useLocation();
  const { displayMenu, setDisplayMenu } = useContext(MenuContext);

  function handleLogout() {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <aside
      className={`hidden lg:block md:fixed top-0 left-0 h-full w-60 md:w-72 z-50
      bg-gradient-to-b from-[#08101b]/90 via-[#091224]/85 to-[#030d15]/90
      backdrop-blur-2xl border-r border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]
      text-slate-100 transition-transform duration-300 ease-in-out
      ${displayMenu ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >

      {/* Header */}
      <header className="flex flex-col items-center justify-center px-6 py-6 border-b border-white/10">
        <div className="relative w-full flex justify-center items-center">
          <h1 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            Aurora
          </h1>
          <FaTimes
            size={22}
            className="absolute right-0 md:hidden cursor-pointer text-slate-400 hover:text-white transition"
            onClick={() => setDisplayMenu(false)}
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          {subtitle === "Admin Panel" ? (
            <FaUserShield size={42} className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
          ) : (
            <FaUserGraduate size={42} className="text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
          )}
          <h2 className="text-sm uppercase tracking-wider text-slate-400">{subtitle}</h2>
        </div>
      </header>

      {/* Navigation */}
      <nav className="px-4 py-8 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {navItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              onClick={
                item.name === "Logout"
                  ? handleLogout
                  : () =>
                    localStorage.setItem(
                      "page-name",
                      item.name && item.name !== "Logout" ? item.name : "Dashboard"
                    )
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${active
                  ? "bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
