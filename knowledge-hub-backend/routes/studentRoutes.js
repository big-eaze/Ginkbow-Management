import express from 'express';
import Student from '../models/adminModels/Student.js';
import Result from "../models/adminModels/Result.js";
import StudentAttendance from "../models/adminModels/studentAttendance.js";

import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';


const router = express.Router();

// @route   GET /api/students
// @desc    Get all student data along with the total count
// @access  Public

router.use(authMiddleware); // Apply authentication middleware to all routes in this file

router.get('/', requireRole("admin"), async (req, res) => {
  try {
    const students = await Student.findAll(); // Fetch all student data from the database
    const totalStudents = await Student.count(); // Get the total number of students

    res.status(200).json({
      totalStudents, // Include the total count as a key
      students, // Include the student data
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/students/:class
// @desc    Get student data for a specific class
// @access  Public
router.get('/:class', requireRole("admin", "staff"), async (req, res) => {
  try {
    const { class: className } = req.params; // Extract class from the URL

    // Fetch students for the specified class
    const students = await Student.findAll({
      where: { class: className }, // Filter students by class
    });

    // Check if students exist for the class
    if (students.length === 0) {
      return res.status(404).json({ message: `No students found for class ${className}.` });
    }

    res.status(200).json({
      totalStudents: students.length, // Include the total count of students in the class
      students, // Include the student data
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students for the class', error: error.message });
  }
});

// @route   POST /api/students
// @desc    Add a new student to the database
// @access  Public
router.post('/', requireRole("admin"), async (req, res) => {
  try {
    console.log("Received:", req.body); // Debug log

    const { admissionNumber, name, class: className, gender, age, parentPhone } = req.body;

    // Create a new student
    const newStudent = await Student.create({
      admissionNumber,
      name,
      class: className, // Use original Sequelize field name
      gender,
      age,
      parentPhone,
    });

    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error("Error creating student:", error.message);
    res.status(400).json({ message: 'Error adding student', error: error.message });
  }
});

// @route   DELETE /api/students/:admissionNumber
// @desc    Delete a student from the database by admissionNumber
// @access  Public

// DELETE /students/:admissionNumber
router.delete("/:admissionNumber", async (req, res) => {
  const { admissionNumber } = req.params;

  try {
    console.log("Attempting to delete student:", admissionNumber);

    // First, delete related records manually
    await Result.destroy({ where: { admissionNumber } });
    await StudentAttendance.destroy({ where: { admissionNumber } });

    // Now delete the student
    const deleted = await Student.destroy({ where: { admissionNumber } });

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
});


export default router;