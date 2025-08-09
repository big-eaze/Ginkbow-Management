import React, { useEffect, useContext } from "react";

import { FaArrowLeft } from "react-icons/fa"; // Import the home icon
import { useNavigate } from "react-router-dom"; // Import navigation hook

import { MenuContext } from "../../Utils/MenuContext.jsx";
import "./ViewResults.css";

function ViewResults() {


  const { viewResults, loadResults } = useContext(MenuContext);
  const navigate = useNavigate();


  

  useEffect(() => {

    loadResults();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <div className="view-results-container">
      <div className="back-to-home" onClick={() => navigate("/ad-academics")}>
        <FaArrowLeft className="fa-arrow" size={30} />
      </div>
      <h2>View Results</h2>
      <div className="results-grid">
        {viewResults?.results?.length > 0 ? (

          viewResults.results.map((result, index) => (
            <div key={index} className="student-card">
              <h3>{result.student.name}</h3>
              <table className="subjects-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((subject, subIndex) => (
                    <tr key={subIndex}>
                      <td>{subject.name}</td>
                      <td>{subject.score}</td>
                      <td>{subject.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))

        ) : (<p>No results available yet.</p>)
        }

      </div>
    </div>
  );
}

export default ViewResults;