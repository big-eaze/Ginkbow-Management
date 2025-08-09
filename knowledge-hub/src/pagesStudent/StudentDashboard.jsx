import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Dir from "../components/Dir";
import Nav2 from "../components/Nav2";
import { studentNavItems } from '../data/navItems';
import './StudentDashboard.css';
import axios from '../Utils/axios.js';







// Register Chart.js components
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend);


function StudentDashboard() {

  const [studentEssentials, setStudentEssentials] = useState({
    noOfCourses: null,
    academicPerformance: "",
    daysPresent: null,
    daysAbsent: null,
    upcomingExams: null
  })

  const stats = [
    { title: "Courses Enrolled", value: studentEssentials.noOfCourses, icon: "📚", color: "blue" },
    { title: "Academic Performance", value: studentEssentials.academicPerformance, icon: "📝", color: "green" },
    { title: "Days present", value: studentEssentials.daysPresent, icon: "✅", color: "purple" },
    { title: "Days absent", value: studentEssentials.daysAbsent, icon: "❌", color: "orange" },
    { title: "Upcoming Exams", value: studentEssentials.upcomingExams, icon: "🕒", color: "purple" },
  ];

  async function loadProfile() {
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data.user;

      await loadStudentData(user.class, user.admissionNumber)

    } catch (err) {
      console.error("Error loading profile data", err);
    }
  }

  async function loadStudentData(userClass, admissionNo) {
    try {
      const coursesRes = await axios.get(`/courses/${userClass}`)
      const performanceRes = await axios.get(`/results/${admissionNo}`);
      const attendanceRes = await axios.get(`/student-attendance/${admissionNo}`);
      const examsRes = await axios.get(`/exam-timetable/upcoming-exams/${userClass}`);

      setStudentEssentials({
        noOfCourses: coursesRes.data.numberOfCourses,
        academicPerformance: performanceRes.data.academicPerformance,
        daysPresent: attendanceRes.data.daysPresent,
        daysAbsent: attendanceRes.data.daysAbsent,
        upcomingExams: examsRes.data.totalUpcomingExams
      })
    }
    catch (err) {
      console.error("Error loading student data", err);
    }
  }


  useEffect(() => {

    loadProfile();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data for the doughnut chart
  const chartData = {
    labels: ["Days present", "Days absent"],
    datasets: [
      {
        label: "Attendance breakdown",
        data: [studentEssentials.daysPresent, studentEssentials.daysAbsent],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Assignment Submissions Over Time",
        font: {
          size: 18,
        },
      },
      legend: {
        position: "bottom"
      }
    },

  };

  return (
    <div className="student-dashboard">
      <Nav2 navItems={studentNavItems} subtitle="Student Panel" />
      <div className="dashboard-content">
        <Dir navItems={studentNavItems} />
        <h1 className="dashboard-heading">Dashboard</h1>
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-info">
                <h2>{stat.value}</h2>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-section">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;