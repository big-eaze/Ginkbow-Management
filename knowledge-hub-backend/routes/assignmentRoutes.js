import express from "express";
import Assignment from "../models/teacherModels/Assignment.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// @route   GET /api/assignments
// @desc    Get all assignments
// @access  Private
// @route   GET /api/assignments
// @desc    Get all assignments with task counts
// @access  Private
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.findAll();

    const enrichedAssignments = assignments.map((assignment) => ({
      ...assignment.toJSON(),
      totalTasks: assignment.tasks.length,
    }));

    res.status(200).json(enrichedAssignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
});


// @route   GET /api/assignments/:class
// @desc    Get assignments for a specific class
// @access  Private
// @route   GET /api/assignments/:class
// @desc    Get assignments for a specific class
// @access  Private
router.get("/:class", requireRole("student", "staff"), async (req, res) => {
  try {
    const { class: className } = req.params;

    const assignment = await Assignment.findOne({ where: { class: className } });

    if (!assignment) {
      return res.status(200).json({
        message: `No assignments added yet for class ${className}.`,
        totalTasks: 0,
        tasks: [],
      });
    }

    res.status(200).json({
      ...assignment.toJSON(),
      totalTasks: assignment.tasks.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments for the class", error: error.message });
  }
});


// @route   POST /api/assignments/:class
// @desc    Add a new assignment for a specific class
// @access  Private
router.post("/:class", requireRole("staff"), async (req, res) => {
  try {
    const { class: className } = req.params;
    const tasksInput = req.body.tasks || [req.body]; // Handle single or multiple tasks
    const isValid = tasksInput.every(task => task.title && task.dueDate && task.description);

    if (!isValid) {
      return res.status(400).json({ message: "Each task must include title, dueDate, and description." });
    }

    let assignment = await Assignment.findOne({ where: { class: className } });

    if (assignment) {
      // Merge new task(s) into existing array
      assignment.tasks = [...assignment.tasks, ...tasksInput];
      await assignment.save();
      return res.status(200).json({ message: "Task(s) added", assignment });
    }

    // No existing record for this class, create new
    const newAssignment = await Assignment.create({
      class: className,
      tasks: tasksInput,
    });

    return res.status(201).json({ message: "Assignment created", assignment: newAssignment });
  } catch (err) {
    res.status(500).json({ message: "Error adding assignment", error: err.message });
  }
});


export default router;
