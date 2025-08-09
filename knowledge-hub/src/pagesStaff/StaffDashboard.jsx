import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement } from "chart.js";
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"
import Nav2 from "../components/Nav2";
import Dir from "../components/Dir";
import { StaffNavItems } from "../data/navItems";
import axios from "../Utils/axios.js";
import "./StaffDashboard.css";




ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend);


function StaffDashboard() {
  const [studentTotal, setStudentTotal] = useState(null);
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
  })
  const [assignments, setAssignments] = useState(null);


  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;
      fetchDataEss(user.class, user.staffId);

    } catch (err) {
      console.error("error fetching user profile", err)
    }
  }

  async function fetchDataEss(userClass, userStaffId) {
    try {
      const response = await axios.get(`/students/${userClass}`);
      const responseAtt = await axios.get(`/staff-attendance/${userStaffId}`);
      const responseCourses = await axios.get(`/assignments/${userClass}`);

      const totalNumberOfStudent = response.data.totalStudents;
      setAttendance({
        present: responseAtt.data.daysPresent,
        absent: responseAtt.data.daysAbsent,
      })
      setStudentTotal(totalNumberOfStudent);
      setAssignments(responseCourses.data.totalTasks);
    } catch (err) {
      console.error("error fetching data", err);
    }
  }

  useEffect(() => {

    loadProfile();

    //eslint-disable-next-line
  }, [])


  const stats = [
    { title: "Total students", value: studentTotal, icon: "👨‍🎓", color: "blue" },
    { title: "Assignments given", value: assignments, icon: "📚", color: "green" },
    { title: "Days present", value: attendance.present, icon: "✅", color: "purple" },
    { title: "Days absent", value: attendance.absent, icon: "❌", color: "orange" },
  ];


  const doughnutData = {
    labels: ["Days Present", "Days Absent"],
    datasets: [
      {
        label: "Attendance Breakdown",
        data: [attendance.present, attendance.absent],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      title: {
        display: true,
        text: "My Attendance Breakdown",
        font: {
          size: 18
        }
      },
      legend: {
        position: "bottom"
      }
    }
  };



  return (
    <div className="staff-dashboard" >
      <Nav2 navItems={StaffNavItems} subtitle="Staff Panel" />
      <div className="dashboard-content">
        <Dir navItems={StaffNavItems} />
        <h1 className="dashboard-heading">Dashboard</h1>
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h2>{stat.value}</h2>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-section">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div >
  );
}

export default StaffDashboard;