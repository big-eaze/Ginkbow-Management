import express from 'express';
import Result from '../models/adminModels/Result.js';
import Student from '../models/adminModels/Student.js'; // Import the Student model
import authMiddleware from '../middleware/authMiddleware.js'; // Import authentication middleware
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Utility function to calculate grade based on score
const calculateGrade = (score) => {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
};

// @route   GET /api/results
// @desc    Get all results data along with the total count, optionally expand student info, calculate performance, and grade each subject
// @access  Private
router.get('/', requireRole("admin"), async (req, res) => {
  try {
    const { expand } = req.query;

    let results;

    if (expand === 'student') {
      results = await Result.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'class', 'admissionNumber'],
          },
        ],
      });
    } else {
      results = await Result.findAll();
    }

    // Calculate performance percentage and grade each subject
    results = results.map((result) => {
      const totalScore = result.subjects.reduce((sum, subject) => sum + subject.score, 0);
      const maxScore = result.subjects.length * 100;
      const academicPerformance = Math.round((totalScore / maxScore) * 100);

      // Add grades to each subject and format names
      const gradedSubjects = result.subjects.map((subject) => ({
        ...subject,
        name: subject.name.charAt(0).toUpperCase() + subject.name.slice(1).toLowerCase(), // Format name
        grade: calculateGrade(subject.score), // Assign grade based on score
      }));

      return {
        ...result.toJSON(),
        academicPerformance: `${academicPerformance}%`,
        subjects: gradedSubjects,
      };
    });

    const totalResults = results.length;

    res.status(200).json({
      totalResults,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/results/:admissionNumber
// @desc    Get a specific user's result data
// @access  Private
router.get('/:admissionNumber', requireRole("student"), async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    // ✅ Ensure the student is accessing only their own result
    if (req.user.role !== "student" || req.user.admissionNumber !== admissionNumber) {
      return res.status(403).json({ message: "Access denied. You can only view your own result." });
    }

    const result = await Result.findOne({ where: { admissionNumber } });

    if (!result) {
      return res.status(404).json({ message: 'Result not found for the given admission number.' });
    }

    // Calculate academic performance
    const totalScore = result.subjects.reduce((sum, subject) => sum + parseFloat(subject.score), 0);
    const maxScore = result.subjects.length * 100;
    const academicPerformance = Math.round((totalScore / maxScore) * 100);

    // Add grades to each subject
    const gradedSubjects = result.subjects.map((subject) => ({
      ...subject,
      grade: calculateGrade(subject.score), // Assign grade based on score
    }));

    res.status(200).json({
      ...result.toJSON(),
      academicPerformance: `${academicPerformance}%`,
      subjects: gradedSubjects,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result', error: error.message });
  }
});

// @route   POST /api/results
// @desc    Add a new result to the database
// @access  Private
router.post('/', requireRole("admin"), async (req, res) => {
  try {
    const { admissionNumber, subjects } = req.body;

    // Validate input
    if (!admissionNumber || !subjects) {
      return res.status(400).json({ message: 'Admission number and subjects are required.' });
    }

    // Format subject names and calculate grades
    const formattedSubjects = subjects.map((subject) => ({
      ...subject,
      name: subject.name.charAt(0).toUpperCase() + subject.name.slice(1).toLowerCase(), // Capitalize first letter
      grade: calculateGrade(subject.score), // Assign grade based on score
    }));

    // Create a new result record
    const newResult = await Result.create({
      admissionNumber,
      subjects: formattedSubjects,
    });

    // Fetch the student details (if available)
    const student = await Student.findOne({
      where: { admissionNumber },
      attributes: ['name', 'class', 'admissionNumber'],
    });

    // Calculate academic performance
    const totalScore = formattedSubjects.reduce((sum, subject) => sum + parseFloat(subject.score), 0);
    const maxScore = formattedSubjects.length * 100; // Assuming each subject has a max score of 100
    const academicPerformance = Math.round((totalScore / maxScore) * 100); // Calculate percentage

    res.status(201).json({
      id: newResult.id,
      admissionNumber: newResult.admissionNumber,
      subjects: formattedSubjects,
      createdAt: newResult.createdAt,
      updatedAt: newResult.updatedAt,
      student: student || { message: 'Student details not found' },
      academicPerformance: `${academicPerformance}%`,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding result', error: error.message });
  }
});

// @route   DELETE /api/results/:id
// @desc    Delete a result by ID
// @access  Private
router.delete('/:id', requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // Find the result by ID
    const result = await Result.findByPk(id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Delete the result
    await result.destroy();

    res.status(200).json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting result', error: error.message });
  }
});

export default router;