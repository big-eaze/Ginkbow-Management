import React, {  useState, useContext } from "react";
import axios from "../../Utils/axios.js";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../Utils/MenuContext";
import "./UploadResult.css";


function UploadResult() {
  const navigate = useNavigate();


  const {loadResults} = useContext(MenuContext);

  const [results, setResults] = useState([]);
  const [admissionNo, setAdmissionNo] = useState("");
  const [submitted, setSubmitted] = useState("");

  const [studentResult, setStudentResult] = useState({
    name: "",
    score: ""
  })

  function handleAdmissionNoSubmit() {
    const trimmed = admissionNo.trim();
    const isValid = /^SCH-\d+$/.test(trimmed);

    if (isValid) {
      setSubmitted(trimmed);
      setAdmissionNo("");
    } else {
      alert("Please enter a valid admission number like SCH-12345");
    }
  }


  function handleUploadResult() {

    const name = studentResult.name.trim();
    const score = Number(studentResult.score);

    if (!name || isNaN(score)) {
      alert("Please provide a valid subject and numeric score.");
      return;
    }

    setResults([...results, { name, score }]);
    setStudentResult({ name: "", score: "" });
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setStudentResult((prev) => ({
      ...prev,
      [name]: value
    }
    ))
  }


  function handleDeleteResult(index) {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };


  async function addResult() {

    if (results.length === 0 || submitted.trim() === "") {
      alert("Please enter admission number and result.");
      return;
    }
    console.log(submitted, results);

    try {
      await axios.post("/results", {
        admissionNumber: submitted,
        subjects: results
      })
      
      await loadResults();

      setResults([]);
      setSubmitted("");
    } catch (error) {
      console.error('error adding result:', error);
    }
  }

  return (

    <div className={`upload-result-container`}>
      <div className="back-to-home" onClick={() => navigate("/ad-academics")}>
        <FaArrowLeft className="arrow-left" size={30} />
      </div>
      <h2>Upload Results</h2>
      <div className="admission-container">
        <h3>Admission-No: ({submitted})</h3>
        <div className="input-btn-container">
          <input className="adm-input" name="admissionNo" value={admissionNo} onChange={(e) => setAdmissionNo(e.target.value)} type="text" placeholder="enter admission number" />
          <button onClick={handleAdmissionNoSubmit} className="admission-btn">Enter</button>
        </div>
      </div>
      <table className="result-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.name}</td>
              <td>{result.score}</td>
              <td>
                <button
                  className="delete-result-btn"
                  onClick={() => handleDeleteResult(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="upload-result-form">
        <input
          type="text"
          name="name"
          placeholder="Subject-name"
          value={studentResult.name}
          onChange={handleInputChange}
          className="upload-result-input"
        />
        <input
          type="number"
          name="score"
          placeholder="Score"
          value={studentResult.score}
          onChange={handleInputChange}
          className="upload-result-input"
        />
        <button className="upload-result-btn" onClick={handleUploadResult}>
          Add
        </button>
      </div>
      <div className="senD-container">
        <button onClick={addResult} className="senD">Upload Result</button>
      </div>
    </div>
  );
}

export default UploadResult;