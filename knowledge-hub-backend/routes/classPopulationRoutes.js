import express from 'express';
import ClassPopulation from '../models/adminModels/ClassPopulation.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(authMiddleware); 

// @route   GET /api/class-population
// @desc    Get all class population data
// @access  Private
router.get('/', requireRole("admin"), async (req, res) => {
  try {
    const classPopulation = await ClassPopulation.findAll(); // Fetch all class population data
    res.status(200).json(classPopulation); // Send the data as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/class-population/:class
// @desc    Update the number of students for a specific class
// @access  Private
router.put('/:class', async (req, res) => {
  try {
    const { class: className } = req.params; // Extract class name from URL
    const { numberOfStudents } = req.body; // Extract number of students from request body

    // Find the class population record by class name
    const classPopulation = await ClassPopulation.findOne({ where: { class: className } });

    if (!classPopulation) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update the number of students
    classPopulation.numberOfStudents = numberOfStudents;
    await classPopulation.save();

    res.status(200).json({ message: 'Class population updated successfully', classPopulation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class population', error: error.message });
  }
});

export default router;