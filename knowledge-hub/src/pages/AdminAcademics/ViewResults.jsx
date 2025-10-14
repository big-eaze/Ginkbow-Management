import React, { useEffect, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../../Utils/MenuContext.jsx";

function ViewResults() {
  const { viewResults, loadResults } = useContext(MenuContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* Page Title */}
      <h2 className="text-2xl font-semibold mb-8 tracking-wide">
        View Results
      </h2>

      {/* Results Section */}
      {viewResults?.results?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewResults.results.map((result, index) => (
            <div
              key={index}
              className="bg-[#0d1825] border border-[#1e2b3c] rounded-2xl p-6 shadow-lg shadow-blue-900/10 hover:shadow-blue-800/20 transition"
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-4">
                {result.student.name}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#111a29] text-gray-400 uppercase text-xs">
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Score</th>
                      <th className="p-3 text-left">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.map((subject, subIndex) => (
                      <tr
                        key={subIndex}
                        className="border-b border-[#1e2b3c] hover:bg-[#111a29]/60 transition duration-150"
                      >
                        <td className="p-3 text-gray-200">{subject.name}</td>
                        <td className="p-3 text-gray-300">{subject.score}</td>
                        <td
                          className={`p-3 font-semibold ${
                            subject.grade === "A"
                              ? "text-green-400"
                              : subject.grade === "B"
                              ? "text-blue-400"
                              : subject.grade === "C"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {subject.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No results available yet.
        </p>
      )}
    </div>
  );
}

export default ViewResults;
