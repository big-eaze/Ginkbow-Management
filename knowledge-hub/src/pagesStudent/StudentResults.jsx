import React, { useEffect, useState } from "react";
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { studentNavItems } from "../data/navItems";
import "./StudentResults.css";
import axios from "../Utils/axios.js";

function StudentResults() {
  const [userAdmissionNumber, setUserAdmissionNumber] = useState("");
  const [resultsData, setResultsData] = useState([]);




  async function loadProfile() {
    const response = await axios.get("/auth/profile");
    const user = response.data.user;
    const admissionNumber = user.admissionNumber;
    setUserAdmissionNumber(admissionNumber);
    fetchResults(admissionNumber);
  }



  async function fetchResults(studentAdm) {
    try {
      const response = await axios.get(`/results/${studentAdm}`);
      const data = response.data;
      setResultsData(data.subjects);
    } catch (err) {
      console.error('error fetching result', err);
    }
  }
  console.log(resultsData);
  useEffect(() => {

    loadProfile();

    //eslint-disable-next-line<h2>Results for {selectedSession} Session</h2>
  }, [])  

  return (
    <div className="student-results">
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      <div className="results-container">
        <Dir navItems={studentNavItems} />
        <h1 className="results-heading">View Results</h1>
        <div className="results-table">
          
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {resultsData.map((result, index) => (
                <tr key={index}>
                  <td>{result.name}</td>
                  <td>{result.score}</td>
                  <td>{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}

export default StudentResults;