import { FiMenu } from 'react-icons/fi';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../Utils/MenuContext';
import axios from '../Utils/axios.js';
import './Dir.css';



function Dir({ navItems }) {

  
  const { displayMenu, setDisplayMenu } = useContext(MenuContext);

  //hooks for the search bar
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();


  //user information
  const [username, setUsername] = useState("");

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;

      setUsername(user.firstName);

    } catch (err) {
      console.error("error fetching profile data", err);
    }
  }

  const navPage = localStorage.getItem("page-name");


  //search bar functionality
  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    console.log(value);

    if (value.trim() === "") {
      setFiltered([]);
    } else {
      const results = navItems.filter((page) => {
        return (
        page.name.toLowerCase().includes(value.toLowerCase()))
      });
      setFiltered(results.slice(0, 5));
    }
  }


  function handleSelect(path) {
    navigate(path);
    setFiltered([]);
    setQuery("");
  }


  useEffect(() => {

    loadProfile();
  }, [])
  return (
    <>
      {/* Overlay */}
      {displayMenu && (
        <div
          className="overlay"
          onClick={() => setDisplayMenu(false)} // Close menu when overlay is clicked
        ></div>
      )}


      <div className='top-container'>
        <div className="first-section">
          <div className='input-menu-con'>
            <div className='menu-container' onClick={() => setDisplayMenu(true)}>
              <FiMenu className='fiMenu' size={20} />
            </div>
            <div className="searchbar-container">
              <input
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Search"
                className="search-input"
              />
              {filtered.length > 0 && (
                <ul className="search-results">
                  {filtered.map((page, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelect(page.path)}
                      className="search-result-item"
                    >
                      {page.name}
                    </li>
                  ))}
                </ul>
              )}
              {(filtered.length === 0 && query !== "") && (
                <ul className="search-results">
                  <li className="search-result-item">No matching page</li>
                </ul>
              )}
            </div>
          </div>
          <h3>Welcome {username}!</h3>
        </div>
        <div className="second-section">Home ➤ <strong> {navPage} </strong></div>
      </div>
    </>

  )
}

export default Dir;