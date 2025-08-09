import express from "express";
import ExamData from "../models/adminModels/ExamData.js";
import { getUpcomingExams } from "../utils/upcomingExams.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// Utility function to format time with AM/PM
const formatTimeWithMeridian = (time) => {
  const [hour, minute] = time.split(":").map(Number); // Split time into hour and minute
  if (hour >= 1 && hour <= 11) {
    return `${time} AM`; // Morning hours
  } else if (hour === 12) {
    return `${time} PM`; // Noon
  } else if (hour >= 13 && hour <= 23) {
    return `${hour - 12}:${minute.toString().padStart(2, "0")} PM`; // Convert to PM
  } else {
    throw new Error("Invalid time format"); // Handle invalid time
  }
};

// GET route to fetch all exam data
router.get("/", async (req, res) => {
  try {
    const exams = await ExamData.findAll();

    // Add a property for the total number of exams
    const examsWithTotalCount = exams.map((examData) => ({
      ...examData.toJSON(),
      totalExams: examData.exams.length, // Calculate total exams dynamically
    }));

    res.status(200).json(examsWithTotalCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to add new exam data
router.post("/", async (req, res) => {
  try {
    const { class: className, subject, date, time, venue } = req.body;

    // Format the time with AM/PM
    const formattedTime = formatTimeWithMeridian(time);

    // Check if the class already exists
    let examData = await ExamData.findOne({ where: { class: className } });

    if (!examData) {
      // If the class doesn't exist, create a new record
      examData = await ExamData.create({
        class: className,
        exams: [], // Initialize with an empty array
      });
    }

    // Append the new exam to the existing exams array
    const newExam = { subject, date, time: formattedTime, venue };
    const updatedExams = [...examData.exams, newExam]; // Append the new exam

    // Update the exams field with the new array
    examData.exams = updatedExams;

    // Save the updated record
    await examData.save();

    res.status(201).json({
      message: "Exam added successfully",
      examData: {
        ...examData.toJSON(),
        totalExams: updatedExams.length, // Include total exams in the response
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get upcoming exams
router.get("/upcoming-exams", async (req, res) => {
  try {
    const upcomingExams = getUpcomingExams();

    // Add total exams property for each class in the upcoming exams response
    const upcomingExamsWithTotalCount = upcomingExams.map((examData) => ({
      ...examData,
      totalExams: examData.exams.length, // Calculate total exams dynamically
    }));

    res.status(200).json(upcomingExamsWithTotalCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming exams", error: error.message });
  }
});

// Route to get upcoming exams for a specific class
router.get("/upcoming-exams/:class", async (req, res) => {
  try {
    const { class: className } = req.params; // Extract class from the URL

    // Fetch the class record
    const examData = await ExamData.findOne({ where: { class: className } });

    if (!examData) {
      return res.status(404).json({ message: `No exams found for class ${className}.` });
    }

    // Filter exams to include only upcoming ones
    const currentDate = new Date();
    const upcomingExams = examData.exams.filter((exam) => new Date(exam.date) > currentDate);

    res.status(200).json({
      class: className,
      upcomingExams,
      totalUpcomingExams: upcomingExams.length, // Include total upcoming exams in the response
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming exams", error: error.message });
  }
});

// DELETE route to remove an exam from the database
router.delete("/:class/:subject", async (req, res) => {
  try {
    const { class: className, subject } = req.params;

    // Find the class record
    const examData = await ExamData.findOne({ where: { class: className } });

    if (!examData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Filter out the exam to be deleted
    const updatedExams = examData.exams.filter((exam) => exam.subject !== subject);

    if (updatedExams.length === examData.exams.length) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Update the exams array
    examData.exams = updatedExams;

    // Save the updated record
    await examData.save();

    res.status(200).json({
      message: "Exam removed successfully",
      examData: {
        ...examData.toJSON(),
        totalExams: updatedExams.length, // Include total exams in the response
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;