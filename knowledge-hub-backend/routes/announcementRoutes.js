import express from "express";
import Announcement from "../models/adminModels/Announcement.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// GET route to fetch all announcements
router.get("/", requireRole("student", "staff", "admin"), async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']], //sort by newest first
    });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert 24-hour time to 12-hour format with AM/PM
const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const { title, date, time, content, receiver } = req.body;

    // Validate input
    if (!title || !date || !time || !content || !receiver) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Convert time to 12-hour format
    const formattedTime = convertTo12HourFormat(time);

    // Handle "both" case
    if (receiver === "both") {
      const staffAnnouncement = await Announcement.create({
        title,
        date,
        time: formattedTime,
        content,
        receiver: "staff",
      });

      const studentAnnouncement = await Announcement.create({
        title,
        date,
        time: formattedTime,
        content,
        receiver: "students",
      });

      return res.status(201).json({
        message: "Announcement successfully sent to both staff and students.",
        announcements: [staffAnnouncement, studentAnnouncement],
      });
    }

    // Handle single receiver case
    const announcement = await Announcement.create({
      title,
      date,
      time: formattedTime,
      content,
      receiver,
    });

    res.status(201).json({
      message: `Announcement successfully sent to ${receiver}.`,
      announcement,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;