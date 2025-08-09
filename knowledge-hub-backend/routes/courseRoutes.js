import express from "express";
import Course from "../models/studentModels/Course.js";
import authMiddleware from "../middleware/authMiddleware.js"; 

const router = express.Router();
router.use(authMiddleware); 

// GET route to fetch all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/courses/:class
// @desc    Fetch course data for a specific class
// @access  Private
router.get("/:class", async (req, res) => {
  try {
    const { class: className } = req.params; // Extract class from the URL

    // Fetch course data for the specified class
    const course = await Course.findOne({
      where: { class: className }, // Filter by class
    });

    // Check if course exists for the class
    if (!course) {
      return res.status(404).json({ error: `No course data found for class ${className}.` });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT route to update the number of courses for a specific class
router.put("/:class", async (req, res) => {
  try {
    const { class: className } = req.params;
    const { numberOfCourses } = req.body;

    // Validate input
    if (!numberOfCourses) {
      return res.status(400).json({ error: "numberOfCourses is required." });
    }

    // Find the course by class and update
    const course = await Course.findOne({ where: { class: className } });
    if (!course) {
      return res.status(404).json({ error: `Class ${className} not found.` });
    }

    course.numberOfCourses = numberOfCourses;
    await course.save();

    res.status(200).json({ message: `Number of courses updated for ${className}.`, course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;