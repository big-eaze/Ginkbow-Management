import React, { useEffect, useState, useContext } from "react"
import axios from "../Utils/axios.js";
import Dir from "../components/Dir"
import { Link } from "react-router-dom"
import Nav2 from "../components/Nav2"
import { MenuContext } from "../Utils/MenuContext.jsx";
import { adminNavItems } from "../data/navItems"
import './StudentsAdmin.css';



function Staffs() {

  const { setStaffData } = useContext(MenuContext);

  async function loadStaffData() {
    try {
      const responseStaff = await axios.get("/staff");
      setStaffData(responseStaff.data);
      setStaffDetails(responseStaff.data.staffMembers);
    } catch (err) {
      console.error("error loading staff data", err);
    }
  }

  useEffect(() => {

    loadStaffData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [errors, setErrors] = useState({});

  const [staff, setStaff] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffDetails, setStaffDetails] = useState([]);
  const [newStaffDetails, setNewStaffDetails] = useState({
    staffId: "",
    name: "",
    subject: "",
    class: "",
    email: "",
    phone: "",
    gender: ""
  })

  function validationForm(data) {
    const newError = {};

    if (!data.staffId.trim() || data.staffId.length !== 8) {
      newError.staffId = "admission number is required!"
    } else if (!data.name.trim()) {
      newError.name = "name is required!"
    } else if (!data.subject.trim()) {
      newError.subject = "subject is required!"
    } else if (!data.class.trim()) {
      newError.class = "class is required!"
    } else if (!data.gender) {
      newError.gender = "gender is required!"
    } else if (!data.phone) {
      newError.phone = "phone number is required!"
    }
    return newError;
  }


  async function addStaffDetails(e) {

    e.preventDefault();

    const validationError = validationForm(newStaffDetails);

    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    try {
      const response = await axios.post("/staff", newStaffDetails);

      setStaffDetails((prev) => [
        ...prev,
        response.data.staff
      ])

      alert("New Student's details submitted");
      await loadStaffData();
      setNewStaffDetails({
        staffId: "",
        name: "",
        subject: "",
        class: "",
        email: "",
        phone: ""
      });

      setErrors({});

    } catch (e) {
      console.error("error adding staff", e.response.data || e.message);
    }

  }




  // State variables for the form inputs 
  // These will hold the values entered by the user
  // and will be used to create a new staff member
  // when the form is submitted

  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = (staffDetails || []).slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(staffDetails.length / rowsPerPage);




  //this calculates the data of the current page!


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  

   async function deleteStaff(staffId) {
      try {
        await axios.delete(`/staff/${staffId}`);
        await loadStaffData();
      } catch(err) {
  
        console.error("error deleting this staff data", err);
      }
  
    }




  function handleInputChange(e) {
    const { name, value } = e.target;

    setNewStaffDetails(
      (prev) => ({
        ...prev,
        [name]: value
      })
    )
  }



  return (
    <div className="overall">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      <div className="stud-contain">
        <div className="students-container">
          <Dir navItems={adminNavItems} />
          <div className="sub-stud-container">
            <div className="students-header">
              <div
                className={`announcement-stud ${!staff ? "active-announce" : ""}`}
                onClick={() => setStaff(false)}
              >
                <img className="folder" src="folder.png" />
                <Link>All Staffs</Link>
              </div>
              <div
                className={`announcement-stud ${staff ? "active-announce" : ""}`}
                onClick={() => setStaff(true)}
              >
                <img className="folder" src="folder.png" />
                <Link>Add Staff</Link>
              </div>
            </div>
  
            <div className={`staff-count ${staff ? "inactive-staff" : "stud-count"}`}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>🡄</button>
              <h3>{currentPage}</h3>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>🡆</button>
            </div>
  
            <div className={staff ? "inactive-staff" : "stud-info"}>
              <div className="responsive-table-wrapper">
                <table className="stud-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Subject</th>
                      <th>Class</th>
                      <th>E-mail</th>
                      <th>Phone</th>
                      <th>Gender</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((data, idx) => (
                      <tr key={idx}>
                        <td>{data.name}</td>
                        <td>{data.subject}</td>
                        <td>{data.class}</td>
                        <td>{data.email}</td>
                        <td>{data.phone}</td>
                        <td>{data.gender}</td>
                        <td>
                          <button onClick={() => deleteStaff(data.staffId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  
            <div className={staff ? "active-staff" : "inactive-staff"}>
              <form onSubmit={addStaffDetails} className="add-staff-form">
                <input
                  type="text"
                  placeholder="staff-id"
                  name="staffId"
                  value={newStaffDetails.staffId}
                  onChange={handleInputChange}
                  className="add-staff-input"
                />
                {errors.staffId && <p className="error">{errors.staffId}</p>}
  
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={newStaffDetails.name}
                  onChange={handleInputChange}
                  className="add-staff-input"
                />
                {errors.name && <p className="error">{errors.name}</p>}
  
                <input
                  type="text"
                  placeholder="Subject"
                  name="subject"
                  value={newStaffDetails.subject}
                  onChange={handleInputChange}
                  className="add-staff-input"
                />
                {errors.subject && <p className="error">{errors.subject}</p>}
  
                <input
                  type="text"
                  placeholder="Class"
                  name="class"
                  value={newStaffDetails.class}
                  onChange={handleInputChange}
                  className="add-staff-input"
                />
                {errors.class && <p className="error">{errors.class}</p>}
  
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={newStaffDetails.email}
                  onChange={handleInputChange}
                  className="add-staff-input"
                />
                {errors.email && <p className="error">{errors.email}</p>}
  
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  value={newStaffDetails.phone}
                  onChange={handleInputChange}
                  className="add-staff-input"
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
  
                <select
                  value={newStaffDetails.gender}
                  name="gender"
                  onChange={handleInputChange}
                  className="add-staff-select"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="error">{errors.gender}</p>}
  
                <button type="submit" className="add-staff-btn">Add Staff</button>
                {errors.api && <p className="error">{errors.api}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}


export default Staffs;