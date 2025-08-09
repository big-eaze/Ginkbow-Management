import { Link } from 'react-router-dom';
import "./RegistrationPage.css";
import React, { Fragment, useState } from 'react';
import axios from './Utils/axios.js';

function RegisterationPage() {

  const [userRole, setUserRole] = useState("");

  function handleRoleSelection(e) {
    setUserRole(e.target.value);
  }

  async function handleSignUp(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post("/auth/signup", {
        ...data,
      }, {
        headers: {
          "content-type": "application/json"
        },
      });

      console.log(response.data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.username);

      alert("Registration successful");

      // Redirect after successful signup
      window.location.href = userRole === "admin" ? "/ad-dashboard"
        : userRole === "student" ? "/st-dashboard"
          : "/ff-dashboard";

    } catch (error) {
      console.error("Signup Error:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="reg-container">
      <div className='reg-body'>
        <form className='reg-form' onSubmit={handleSignUp}>
          <div className='reg-form-select'>
            <select defaultValue="" data-testid="role-selection" onChange={handleRoleSelection}>
              <option className="select-role" value="" disabled hidden>select role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
            <Fragment>
              {userRole && (
                <>
                  <input type="hidden" name="role" value={userRole} />

                  <input type="text" id="firstname" name="firstName" placeholder="First-Name" required />
                  <input type="text" id="lastname" name="lastName" placeholder="Last-Name" required />
                  <input type="text" id="username" name="username" placeholder='Username' required />

                  {userRole !== "student" && <input type="email" id="email" name="email" placeholder='Email' required />}

                  <input
                    type="text"
                    id={userRole === "admin" ? "adminId" : userRole === "student" ? "admissionNumber" : "staffId"}
                    data-testid={userRole === "admin" ? "adminId" : userRole === "student" ? "admissionNumber" : "staffId"}
                    name={userRole === "admin" ? "adminId" : userRole === "student" ? "admissionNumber" : "staffId"}
                    placeholder={userRole === "admin" ? "adminId" : userRole === "student" ? "admissionNumber" : "staffId"}
                    required
                  />

                  {userRole === "staff" && (
                    <>
                      <input type='text' data-testid="staff-role" id='class' name='class' placeholder='class' required />
                      <input type='text' data-testid="staff-role" id='subject' name="subject" placeholder='subject' required />
                    </>
                  )}

                  <input type="password" id="password" name="password" placeholder='Password' required />
                  <input type="password" id="confirmPassword" name="confirmPassword" placeholder='confirm password' required />
                </>
              )}
            </Fragment>
          </div>
          <button data-testid="registration-btn" className='reg reg-btn' type='submit'>REGISTER</button>
        </form>
        <button className="signin-btn" onClick={() => window.location.href = "/"}>Sign In</button>
        <h2 className='school'>GINKBOW INNOVATION</h2>
      </div>
    </div>
  );
}

export default RegisterationPage;