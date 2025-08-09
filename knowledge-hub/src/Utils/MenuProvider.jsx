import React, { useState } from "react";
import { MenuContext } from "./MenuContext"; // Import MenuContext
import axios from "./axios.js";

export function MenuProvider({ children }) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [studentsData, setStudentsData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [staffAtt, setStaffAtt] = useState([]);
  const [classPopulation, setClassPopulation] = useState([]);
  const [examSchedule, setExamSchedule] = useState([]);
  const [viewResults, setViewResults] = useState([]);
  const [navPage, setNavPage] = useState("Dashboard");
  const [announcement, setAnnouncement] = useState([]);


  
  //specifically for student
  async function loadResults() {
    try {
      const responseViewResults = await axios.get("/results?expand=student");
      setViewResults(responseViewResults.data);

    } catch (err) {
      console.error("error loading exam results", err)
    }
  }



  return (
    <MenuContext.Provider value={
      {
        displayMenu,
        setDisplayMenu,
        studentsData,
        setStudentsData,
        staffData,
        setStaffData,
        staffAtt,
        setStaffAtt,
        classPopulation,
        setClassPopulation,
        examSchedule,
        setExamSchedule,
        viewResults,
        setViewResults,
        loadResults,
        navPage,
        setNavPage,
        announcement,
        setAnnouncement
      }}>
      {children}
    </MenuContext.Provider>
  );
}


//https://chatgpt.com/c/685eaa58-cb4c-8008-ab86-adb375ef994b