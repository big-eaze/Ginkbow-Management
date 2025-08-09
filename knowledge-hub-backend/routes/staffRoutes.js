import express from "express";
import Staff from "../models/adminModels/Staff.js";
import StaffAttendance from "../models/adminModels/studentAttendance.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware
import { requireRole } from '../middleware/roleMiddleware.js';



const router = express.Router();

router.use(authMiddleware);

// @route   GET /api/staff
// @desc    Get all staff members with total staff count
// @access  Private
router.get("/", requireRole("admin"), async (req, res) => {
  try {
    const staffMembers = await Staff.findAll(); // Fetch all staff members
    const totalStaff = await Staff.count(); // Count the total number of staff members

    res.status(200).json({ totalStaff, staffMembers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff members", error: error.message });
  }
});

// @route   GET /api/staff/:staffId
// @desc    Get a specific staff member by staffId
// @access  Private
router.get("/:staffId", requireRole("admin"), async (req, res) => {
  try {
    const { staffId } = req.params; // Extract staffId from the URL

    const staffMember = await Staff.findOne({ where: { staffId } }); // Find staff by staffId

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    res.status(200).json(staffMember);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff member", error: error.message });
  }
});

// @route   POST /api/staff
// @desc    Add a new staff member
// @access  Private
// DELETE route
router.delete("/:staffId", requireRole("admin"), async (req, res) => {
  try {
    const { staffId } = req.params;

    const staffMember = await Staff.findOne({ where: { staffId } });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    // 💡 Clean up attendance records
    const attendanceRecords = await StaffAttendance.findAll();

    for (const record of attendanceRecords) {
      const status = record.staffStatus;

      // 🛡 Defensive check
      if (Array.isArray(status)) {
        const updatedStatus = status.filter(entry => entry.staffId !== staffId);

        if (updatedStatus.length !== status.length) {
          record.staffStatus = updatedStatus;
          await record.save();
        }
      }
    }

    await staffMember.destroy();
    const totalStaff = await Staff.count();

    res.status(200).json({ message: "Staff member deleted successfully.", totalStaff });

  } catch (error) {
    console.error("❌ Error in DELETE /staff/:staffId:", error);
    res.status(500).json({ message: "Error deleting staff member", error: error.message });
  }
});


// @route   DELETE /api/staff/:staffId
// @desc    Delete a staff member by staffId
// @access  Private
router.delete("/:staffId", requireRole("admin"), async (req, res) => {
  try {
    const { staffId } = req.params;

    const staffMember = await Staff.findOne({ where: { staffId } });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    // 💡 Option 1: Clean up attendance records first
    const attendanceRecords = await StaffAttendance.findAll();
    for (const record of attendanceRecords) {
      const originalLength = record.staffStatus.length;

      // Remove the deleted staffId from staffStatus array
      const updatedStatus = record.staffStatus.filter(entry => entry.staffId !== staffId);

      if (updatedStatus.length !== originalLength) {
        record.staffStatus = updatedStatus;
        await record.save(); // Save only if we made a change
      }
    }

    // ✅ Now it's safe to delete the staff
    await staffMember.destroy();

    const totalStaff = await Staff.count();

    res.status(200).json({ message: "Staff member deleted successfully.", totalStaff });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff member", error: error.message });
  }
});

export default router;