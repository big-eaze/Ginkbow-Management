import { FaUserTie } from "react-icons/fa6";
import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav2.css";
import { MenuContext } from "../Utils/MenuContext";
import axios from "../Utils/axios.js";
import { FaTimes, FaUserShield, FaUserGraduate } from "react-icons/fa";

function Nav2({ navItems, subtitle}) {
  const location = useLocation(); // Determine the current path
  const [isClicked, setIsClicked] = useState(0);

  const { displayMenu, setDisplayMenu} = useContext(MenuContext);


  function handleLogout() {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <>
      <div className={`nav-container ${displayMenu ? 'active-nav' : 'inactive-nav'}`}>
        <header className="nav-header">
          <div className="nav-title">
            <h1>GinkBow</h1>
            <FaTimes
              size={30}
              className="close-icon"
              onClick={() => setDisplayMenu(false)}
            />
          </div>
          <div className="nav-subtitle">
            {subtitle === 'Admin Panel' ? <FaUserShield size={50} /> : <FaUserGraduate size={50} />}
            <h2>{subtitle}</h2>
          </div>
        </header>
        <section className="nav-section">
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li
                key={index}
                className={`nav-item ${location.pathname === item.path ? 'active-nav-item' : ''}`}
                onClick={() =>  {
                  setIsClicked(index)
                  localStorage.setItem("page-name", (item.name && item.name !== "Logout") ? item.name  : "Dashboard")
                }}
              >
                <Link to={item.path} onClick={item.name === "Logout" ? () => handleLogout() : undefined} className="nav-link" >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default Nav2;