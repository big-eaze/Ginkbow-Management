import express from "express";
import StudentAttendance from "../models/adminModels/studentAttendance.js";
import Student from "../models/adminModels/Student.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Utility function to calculate weekly attendance rate
const calculateWeeklyAttendanceRate = async (admissionNumber) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calculate the date 7 days ago

  const attendanceRecords = await StudentAttendance.findAll({
    where: {
      admissionNumber,
      date: { $gte: oneWeekAgo }, // Fetch records from the last 7 days
    },
  });

  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((record) => record.status === "present").length;

  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0; // Return attendance rate as a percentage
};

// Utility function to calculate overall attendance percentage
const calculateOverallAttendanceRate = async (admissionNumber) => {
  const attendanceRecords = await StudentAttendance.findAll({
    where: { admissionNumber },
  });

  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((record) => record.status === "present").length;

  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0; // Return attendance rate as a percentage
};

// @route   GET /api/student-attendance
// @desc    Fetch overall attendance rate for all students
// @access  Private
router.get("/", requireRole("admin"), async (req, res) => {
  try {
    const attendanceRecords = await StudentAttendance.findAll();
    const students = await Student.findAll({
      attributes: ["admissionNumber", "name", "class"]
    });

    const enrichedData = await Promise.all(
      students.map(async (student) => {
        const studentRecords = attendanceRecords.filter(
          (r) => r.admissionNumber === student.admissionNumber
        );

        const totalDays = studentRecords.length;
        const daysPresent = studentRecords.filter((r) => r.status === "present").length;
        const daysAbsent = studentRecords.filter((r) => r.status === "absent").length;

        const weeklyRate = calculateWeeklyAttendanceRate(attendanceRecords, student.admissionNumber);
        const overallRate = totalDays > 0 ? (daysPresent / totalDays) * 100 : 0;

        return {
          studentDetails: student,
          totalDays,
          daysPresent,
          daysAbsent,
          weeklyAttendanceRate: `${weeklyRate.toFixed(0)}%`,
          overallAttendanceRate: `${overallRate.toFixed(0)}%`,
        };
      })
    );

    res.status(200).json({ studentsAttendance: enrichedData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student attendance data", error: error.message });
  }
});


// @route   GET /api/student-attendance/:admissionNumber
// @desc    Fetch attendance data for a specific student
// @access  Private
router.get("/:admissionNumber", requireRole("admin", "student"), async (req, res) => {
  const { admissionNumber } = req.params;

  try {
    // Fetch attendance records for this student
    const attendanceRecords = await StudentAttendance.findAll({
      where: { admissionNumber },
    });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance data found for the given admission number." });
    }

    // Calculate stats
    const totalDays = attendanceRecords.length;
    const daysPresent = attendanceRecords.filter((r) => r.status === "present").length;
    const daysAbsent = attendanceRecords.filter((r) => r.status === "absent").length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyRecords = attendanceRecords.filter(
      (r) => new Date(r.date) >= oneWeekAgo
    );
    const weeklyPresent = weeklyRecords.filter((r) => r.status === "present").length;
    const weeklyAttendanceRate = weeklyRecords.length > 0
      ? (weeklyPresent / weeklyRecords.length) * 100
      : 0;

    const overallAttendanceRate = totalDays > 0
      ? (daysPresent / totalDays) * 100
      : 0;

    // Fetch student details
    const studentDetails = await Student.findOne({
      where: { admissionNumber },
      attributes: ["admissionNumber", "name", "class", "gender", "age", "parentPhone"],
    });

    if (!studentDetails) {
      return res.status(404).json({ message: "Student details not found for the given admission number." });
    }

    res.status(200).json({
      studentDetails,
      totalDays,
      daysPresent,
      daysAbsent,
      weeklyAttendanceRate: `${weeklyAttendanceRate.toFixed(0)}%`,
      overallAttendanceRate: `${overallAttendanceRate.toFixed(0)}%`,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance data", error: error.message });
  }
});


// @route   POST /api/student-attendance
// @desc    Mark attendance for a specific student
// @access  Private (Staff only)
router.post("/", requireRole("staff"), async (req, res) => {
  const { admissionNumber, date, status } = req.body;

  try {
    // Validate input
    if (!admissionNumber || !date || !status) {
      return res.status(400).json({ message: "Admission number, date, and status are required." });
    }

    // Check if the student exists
    const student = await Student.findOne({ where: { admissionNumber } });
    if (!student) {
      return res.status(404).json({ message: `Student with admission number ${admissionNumber} not found.` });
    }

    // Check if attendance for the date already exists
    const existingAttendance = await StudentAttendance.findOne({
      where: { date, admissionNumber },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance for this date has already been marked." });
    }

    // Create a new attendance record
    const attendance = await StudentAttendance.create({
      admissionNumber,
      date,
      status,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;