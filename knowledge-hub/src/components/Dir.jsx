import { FiMenu } from "react-icons/fi";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../Utils/MenuContext";
import axios from "../Utils/axios.js";

export default function Dir({ navItems }) {
  const { displayMenu, setDisplayMenu } = useContext(MenuContext);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const navPage = localStorage.getItem("page-name");

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      setUsername(response.data.user.firstName);
    } catch (err) {
      console.error("Error fetching profile data", err);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setFiltered([]);
    } else {
      const results = navItems.filter((page) =>
        page.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results.slice(0, 5));
    }
  }

  function handleSelect(path) {
    navigate(path);
    setFiltered([]);
    setQuery("");
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 bg-gray-900/60 backdrop-blur-xl border-b border-gray-800 shadow-lg text-gray-200 relative z-40">
        {/* Left section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {/* Menu & Search */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setDisplayMenu(true)}
              className="p-2 lg:hidden block rounded-lg bg-gray-800/70 hover:bg-gray-700 transition"
            >
              <FiMenu className="w-5 h-5 text-cyan-400" />
            </button>

            <div className="relative flex-1 md:flex-none w-full md:w-80">
              <input
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Search pages..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800/60 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 outline-none transition"
              />
              {filtered.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-gray-900/90 border border-gray-700 rounded-lg shadow-lg z-50">
                  {filtered.map((page, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelect(page.path)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-800 text-gray-200 transition"
                    >
                      {page.name}
                    </li>
                  ))}
                </ul>
              )}
              {filtered.length === 0 && query.trim() !== "" && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-gray-900/90 border border-gray-700 rounded-lg shadow-lg z-50">
                  <li className="px-4 py-2 text-gray-400">No matching page</li>
                </ul>
              )}
            </div>
          </div>

          {/* Welcome */}
          <h3 className="text-lg font-medium text-gray-300 mt-3 md:mt-0">
            Welcome,{" "}
            <span className="text-cyan-400 font-semibold">{username || "User"}</span> 👋
          </h3>
        </div>

        {/* Breadcrumb */}
        <div className="text-gray-400 text-sm mt-4 md:mt-0">
          Home <span className="mx-2 text-cyan-400">➤</span>
          <strong className="text-gray-200">{navPage}</strong>
        </div>
      </div>
    </>
  );
}
