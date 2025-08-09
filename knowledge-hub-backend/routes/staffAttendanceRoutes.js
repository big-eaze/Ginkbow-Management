import express from "express";
import StaffAttendance from "../models/adminModels/staffAttendance.js";
import Staff from "../models/adminModels/Staff.js"; // Import the Staff model
import authMiddleware from "../middleware/authMiddleware.js"; // Import authentication middleware
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware); // Apply authentication middleware to all routes in this file

const calculateWeeklyAttendanceRate = (attendanceRecords, staffId) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calculate the date 7 days ago

  let totalDays = 0;
  let presentDays = 0;

  attendanceRecords.forEach((record) => {
    const recordDate = new Date(record.date);
    const dayOfWeek = recordDate.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)

    // Only consider weekdays (Monday to Friday)
    if (recordDate >= oneWeekAgo && dayOfWeek >= 1 && dayOfWeek <= 5) {
      const staffStatus = record.staffStatus.find((status) => status.id === staffId);
      if (staffStatus) {
        totalDays++;
        if (staffStatus.status === "present") {
          presentDays++;
        }
      }
    }
  });

  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0; // Return attendance rate as a percentage
};



router.get("/", requireRole("admin"), async (req, res) => {
  try {
    const { expand } = req.query;
    const attendanceData = await StaffAttendance.findAll();

    // Collect unique staffIds from attendance data
    const allStaffIds = new Set();
    attendanceData.forEach((record) => {
      record.staffStatus.forEach((status) => {
        allStaffIds.add(status.id);
      });
    });

    // Build attendance summary for each staff
    const summary = await Promise.all(
      Array.from(allStaffIds).map(async (staffId) => {
        const weeklyAttendanceRate = calculateWeeklyAttendanceRate(attendanceData, staffId);

        // Filter all attendance records for this staffId
        const filteredAttendance = attendanceData.map((record) => {
          const staffStatus = record.staffStatus.filter((s) => s.id === staffId);
          return { date: record.date, staffStatus };
        }).filter((record) => record.staffStatus.length > 0);

        const totalDays = filteredAttendance.length;
        const daysPresent = filteredAttendance.filter(record =>
          record.staffStatus[0]?.status === "present"
        ).length;
        const daysAbsent = totalDays - daysPresent;

        const overallAttendanceRate = totalDays > 0
          ? (daysPresent / totalDays) * 100
          : 0;

        // If expand=staff, fetch staff details
        let staffDetails = null;
        if (expand === "staff") {
          staffDetails = await Staff.findOne({ where: { staffId } });
        }

        return {
          staffId,
          staffDetails,
          totalDays,
          daysPresent,
          daysAbsent,
          weeklyAttendanceRate: `${weeklyAttendanceRate.toFixed(0)}%`,
          overallAttendanceRate: `${overallAttendanceRate.toFixed(0)}%`,
        };
      })
    );

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff attendance data", error: error.message });
  }
});





router.get("/:staffId", requireRole("admin", "staff"), async (req, res) => {
  try {
    const { staffId } = req.params;
    const { expand } = req.query;

    const attendanceData = await StaffAttendance.findAll();

    const filteredAttendance = attendanceData.map((record) => {
      const staffStatus = record.staffStatus.filter((status) => status.id === staffId);
      return {
        date: record.date,
        staffStatus,
      };
    }).filter((record) => record.staffStatus.length > 0);

    if (filteredAttendance.length === 0) {
      return res.status(404).json({ message: "No attendance data found for the given staff ID." });
    }

    const weeklyAttendanceRate = calculateWeeklyAttendanceRate(attendanceData, staffId);

    // ✅ NEW overall attendance stats
    const totalDays = filteredAttendance.length;
    const daysPresent = filteredAttendance.filter(record =>
      record.staffStatus[0]?.status === "present"
    ).length;
    const daysAbsent = totalDays - daysPresent;

    const overallAttendanceRate = totalDays > 0
      ? (daysPresent / totalDays) * 100
      : 0;

    if (expand === "staff") {
      const staffDetails = await Staff.findOne({ where: { staffId } });

      if (!staffDetails) {
        return res.status(404).json({ message: "Staff details not found for the given staff ID." });
      }

      return res.status(200).json({
        staffDetails,
        totalDays,
        daysPresent,
        daysAbsent,
        weeklyAttendanceRate: `${weeklyAttendanceRate.toFixed(0)}%`,
        overallAttendanceRate: `${overallAttendanceRate.toFixed(0)}%`,
        attendance: filteredAttendance,
      });
    }

    res.status(200).json({
      totalDays,
      daysPresent,
      daysAbsent,
      weeklyAttendanceRate: `${weeklyAttendanceRate.toFixed(2)}%`,
      overallAttendanceRate: `${overallAttendanceRate.toFixed(2)}%`,
      attendance: filteredAttendance,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance data", error: error.message });
  }
});





router.post("/:staffId", requireRole("staff"), async (req, res) => {
  try {
    const { staffId } = req.params; // Extract staffId from the URL
    const { date, status } = req.body; // Extract date and status from the request body

    // Validate input
    if (!date || !status) {
      return res.status(400).json({ message: "Date and status are required." });
    }

    // Find the attendance record for the given date
    let attendanceRecord = await StaffAttendance.findOne({ where: { date } });

    if (!attendanceRecord) {
      // If no record exists for the date, create a new one
      attendanceRecord = await StaffAttendance.create({
        date,
        staffStatus: [{ id: staffId, status }],
      });
    } else {
      // If a record exists, update the staffStatus array
      const existingStatusIndex = attendanceRecord.staffStatus.findIndex(
        (entry) => entry.id === staffId
      );

      if (existingStatusIndex !== -1) {
        // Update the existing status
        attendanceRecord.staffStatus[existingStatusIndex].status = status;
      } else {
        // Add a new status entry for the staff member
        attendanceRecord.staffStatus.push({ id: staffId, status });
      }

      // Save the updated record
      await attendanceRecord.save();
    }

    res.status(200).json({
      message: "Attendance status updated successfully.",
      attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance status", error: error.message });
  }
});

export default router;