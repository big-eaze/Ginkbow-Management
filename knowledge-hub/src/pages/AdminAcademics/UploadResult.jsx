import React, { useState, useContext } from "react";
import axios from "../../Utils/axios.js";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../Utils/MenuContext";

function UploadResult() {
  const navigate = useNavigate();
  const { loadResults } = useContext(MenuContext);

  const [results, setResults] = useState([]);
  const [admissionNo, setAdmissionNo] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [studentResult, setStudentResult] = useState({ name: "", score: "" });

  const handleAdmissionNoSubmit = () => {
    const trimmed = admissionNo.trim();
    const isValid = /^SCH-\d+$/.test(trimmed);

    if (isValid) {
      setSubmitted(trimmed);
      setAdmissionNo("");
    } else {
      alert("Please enter a valid admission number like SCH-12345");
    }
  };

  const handleUploadResult = () => {
    const name = studentResult.name.trim();
    const score = Number(studentResult.score);

    if (!name || isNaN(score)) {
      alert("Please provide a valid subject and numeric score.");
      return;
    }

    setResults([...results, { name, score }]);
    setStudentResult({ name: "", score: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentResult((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteResult = (index) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const addResult = async () => {
    if (results.length === 0 || submitted.trim() === "") {
      alert("Please enter admission number and results.");
      return;
    }

    try {
      await axios.post("/results", {
        admissionNumber: submitted,
        subjects: results,
      });
      await loadResults();
      setResults([]);
      setSubmitted("");
    } catch (error) {
      console.error("Error adding result:", error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-[#07101a] via-[#081022] to-[#030d15] min-h-screen text-gray-200">
      {/* Back Button */}
      <div
        className="flex items-center text-blue-400 cursor-pointer hover:text-blue-500 mb-6 transition"
        onClick={() => navigate("/ad-academics")}
      >
        <FaArrowLeft className="mr-2" />
        <span className="font-medium">Back</span>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-8 tracking-wide">
        Upload Results
      </h2>

      {/* Admission Number Section */}
      <div className="bg-[#0d1825] border border-[#1e2b3c] shadow-lg shadow-blue-900/10 p-6 rounded-2xl mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-300">
          Admission Number:{" "}
          <span className="text-blue-400 font-semibold">
            {submitted || "None"}
          </span>
        </h3>

        <div className="flex flex-wrap gap-3">
          <input
            className="bg-[#111a29] border border-[#1e2b3c] rounded-lg px-3 py-2 flex-1 min-w-[200px] text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
            name="admissionNo"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value)}
            type="text"
            placeholder="Enter admission number (e.g. SCH-12345)"
          />
          <button
            onClick={handleAdmissionNoSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Enter
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[#0d1825] border border-[#1e2b3c] shadow-lg shadow-blue-900/10 p-6 rounded-2xl mb-8">
        <h3 className="text-lg font-medium text-gray-300 mb-4">
          Subject Scores
        </h3>

        <table className="w-full border-collapse text-gray-200">
          <thead>
            <tr className="bg-[#111a29] text-gray-400 uppercase text-sm">
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <tr
                  key={index}
                  className="border-b border-[#1e2b3c] hover:bg-[#111a29]/60 transition duration-150"
                >
                  <td className="p-3">{result.name}</td>
                  <td className="p-3">{result.score}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteResult(index)}
                      className="text-red-400 hover:text-red-500 hover:bg-[#2a0f0f] px-3 py-1 rounded-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No results added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Subject Form */}
      <div className="bg-[#0d1825] border border-[#1e2b3c] shadow-lg shadow-blue-900/10 p-6 rounded-2xl mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          name="name"
          placeholder="Subject name"
          value={studentResult.name}
          onChange={handleInputChange}
          className="bg-[#111a29] border border-[#1e2b3c] rounded-lg px-3 py-2 flex-1 min-w-[150px] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="number"
          name="score"
          placeholder="Score"
          value={studentResult.score}
          onChange={handleInputChange}
          className="bg-[#111a29] border border-[#1e2b3c] rounded-lg px-3 py-2 flex-1 min-w-[150px] text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          onClick={handleUploadResult}
        >
          Add
        </button>
      </div>

      {/* Upload Button */}
      <div className="text-right">
        <button
          onClick={addResult}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Upload Result
        </button>
      </div>
    </div>
  );
}

export default UploadResult;
