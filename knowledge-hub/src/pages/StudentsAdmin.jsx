import React, { useContext, useEffect, useState } from "react";
import axios from "../Utils/axios.js";
import { Link } from "react-router-dom";
import Dir from "../components/Dir";
import './StudentsAdmin.css';
import Nav2 from "../components/Nav2";
import { adminNavItems } from "../data/navItems";
import { MenuContext } from "../Utils/MenuContext.jsx";

function StudentsAdmin() {
  const [errors, setErrors] = useState({});
  const { studentsData, setStudentsData } = useContext(MenuContext);
  const [student, setStudent] = useState(false);
  const [studDetails, setStudDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  async function loadStudentData() {
    try {
      const response = await axios.get("/students");
      setStudentsData(response.data);
      setStudDetails(response.data.students);
    } catch (err) {
      console.error("Error loading students data", err.message)
    }
  }

  useEffect(() => {
    loadStudentData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [newStudentDetails, setNewStudentDetails] = useState({
    admissionNumber: "",
    name: "",
    class: "",
    gender: "",
    age: "",
    parentPhone: ""
  });

  function validationForm(data) {
    const newError = {};
    if (!data.admissionNumber.trim()) newError.admissionNumber = "admission number is required!";
    if (!data.name.trim()) newError.name = "name is required!";
    if (!data.class.trim()) newError.class = "class is required!";
    if (!data.age || isNaN(data.age)) newError.age = "valid age is required!";
    if (!data.gender) newError.gender = "gender is required!";
    if (!data.parentPhone) newError.parentPhone = "parent's phone number is required!";
    return newError;
  }

  async function addStudentData(e) {
    e.preventDefault();

    const fixedStudentDetails = {
      ...newStudentDetails,
      age: Number(newStudentDetails.age),
    };

    const validationError = validationForm(newStudentDetails);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }

    try {
      const response = await axios.post("/students", fixedStudentDetails);
      setStudDetails((prev) => [...prev, response.data.student]);
      await loadStudentData();

      setNewStudentDetails({
        admissionNumber: "",
        name: "",
        class: "",
        gender: "",
        age: "",
        parentPhone: ""
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding student:", error.response?.data || error.message);
    }
  }

  function handleInputChanges(e) {
    const { name, value } = e.target;
    setNewStudentDetails((prev) => ({ ...prev, [name]: value }));
  }

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = (studDetails || []).slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(studDetails.length / rowsPerPage);

  async function deleteStudent(admissionNo) {
    try {
      await axios.delete(`/students/${admissionNo}`);
      await loadStudentData();
    } catch(err) {

      console.error("error deleting this student data", err);
    }

  }

  function handlePreviousPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  function handleNextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  return (
    <div className="overall">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      <div className="stud-contain">
        <div className="students-container">
          <Dir navItems={adminNavItems} />
          <div className="sub-stud-container">
            <div className="students-header">
              <div className={`announcement-stud ${student ? '' : 'active-announce'}`} onClick={() => setStudent(false)}>
                <img className="folder" src="/folder.png" alt="folder" /><Link>All Students</Link>
              </div>
              <div className={`announcement-stud ${student ? 'active-announce' : ''}`} onClick={() => setStudent(true)}>
                <img className="folder" src="/folder.png" alt="folder" /><Link>Add students</Link>
              </div>
            </div>

            <div className={`staff-count ${student ? 'inactive-staff' : 'stud-count'}`}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}> 🡄 </button>
              <h3>{currentPage}</h3>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}> 🡆 </button>
            </div>

            <div className={student ? 'inactive-staff' : 'stud-info'}>
              <div className="responsive-table-wrapper">
                <table className="stud-table">
                  <thead>
                    <tr>
                      <th>Admission No.</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Parent Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((data, idx) => (
                      <tr key={idx}>
                        <td>{data.admissionNumber}</td>
                        <td>{data.name}</td>
                        <td>{data.class}</td>
                        <td>{data.gender}</td>
                        <td>{data.age}</td>
                        <td>{data.parentPhone}</td>
                        <td>
                          <button onClick={() => deleteStudent(data.admissionNumber)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Student Form */}
            <div className={student ? 'active-staff' : 'inactive-staff'}>
              <form onSubmit={addStudentData} className="add-staff-form">
                <input
                  type="text"
                  placeholder="Admission No"
                  name="admissionNumber"
                  value={newStudentDetails.admissionNumber}
                  onChange={handleInputChanges}
                  className="add-staff-input"
                />
                {errors.admissionNumber && <p className="error">{errors.admissionNumber}</p>}

                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={newStudentDetails.name}
                  onChange={handleInputChanges}
                  className="add-staff-input"
                />
                {errors.name && <p className="error">{errors.name}</p>}

                <input
                  type="text"
                  placeholder="Class"
                  name="class"
                  value={newStudentDetails.class}
                  onChange={handleInputChanges}
                  className="add-staff-input"
                />
                {errors.class && <p className="error">{errors.class}</p>}

                <input
                  type="number"
                  placeholder="Age"
                  name="age"
                  value={newStudentDetails.age}
                  onChange={handleInputChanges}
                  className="add-staff-input"
                />
                {errors.age && <p className="error">{errors.age}</p>}

                <input
                  type="text"
                  placeholder="Parent's contact"
                  name="parentPhone"
                  value={newStudentDetails.parentPhone}
                  onChange={handleInputChanges}
                  className="add-staff-input"
                />
                {errors.parentPhone && <p className="error">{errors.parentPhone}</p>}

                <select
                  value={newStudentDetails.gender}
                  name="gender"
                  onChange={handleInputChanges}
                  className="add-staff-select"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="error">{errors.gender}</p>}

                <button
                  type="submit"
                  className="add-staff-btn">
                  Add Student
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsAdmin;
