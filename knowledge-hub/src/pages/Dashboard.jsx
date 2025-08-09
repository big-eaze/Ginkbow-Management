import React, { useEffect, useState } from 'react';
import { MenuContext } from '../Utils/MenuContext.jsx';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Dir from "../components/Dir";
import Nav2 from "../components/Nav2";
import axios from '../Utils/axios.js';
import { adminNavItems } from '../data/navItems.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend);

function Dashboard() {
  const [overallDetails, setOverallDetails] = useState({
    totalStudents: "",
    totalStaff: "",
    totalResultsUploaded: ""
  });
 
  async function fetchData() {
    const responseStudent = await axios.get("/students");
    const responseStaff = await axios.get("/staff");
    const responseViewResults = await axios.get("/results?expand=student");

    console.log(responseViewResults.data);
    setOverallDetails(() => ({
      totalStudents: responseStudent.data.totalStudents,
      totalStaff: responseStaff.data.totalStaff,
      totalResultsUploaded: responseViewResults.data.totalResults
    }))
  }

  useEffect(() => {


    fetchData()
  }, []);

  /* if ((overallDetails.totalStaff === "" || overallDetails.totalStudents === "" || overallDetails.totalResultsUploaded === ""
   )) {
     return <p>Loading data........</p>
   } */


  const stats = [
    { title: "Total Students", value: overallDetails.totalStudents, icon: "👨‍🎓", color: "blue" },
    { title: "Total Staff", value: overallDetails.totalStaff, icon: "👩‍🏫", color: "green" },
    { title: "Results uploaded", value: overallDetails.totalResultsUploaded, icon: "📊", color: "orange" }
  ];

  // Data for the doughnut chart
  const chartData = {
    labels: ["Students", "Staff"],
    datasets: [
      {
        label: "School stats",
        data: [overallDetails.totalStudents, overallDetails.totalStaff],
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
        text: "School Distribution",
        font: {
          size: 18,
        },
      },
      legend: {
        position: "bottom"
      },
    },

  };
  return (
    <div className="dashboard">
      <Nav2 navItems={adminNavItems} subtitle="Admin Panel" />
      <div className="dashboard-content">
        <Dir navItems={adminNavItems} />
        <h1 className="dashboard-heading">Dashboard Overview</h1>
        <div className="stat-container">
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
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;