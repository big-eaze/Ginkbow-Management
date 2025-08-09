import sequelize from "./config/sequelize.js";

// Import all models
import StudentAttendance from "./models/adminModels/studentAttendance.js";
import StaffAttendance from "./models/adminModels/staffAttendance.js";
import Assignment from "./models/teacherModels/Assignment.js";
import Announcement from "./models/adminModels/Announcement.js";
import ClassPopulation from "./models/adminModels/ClassPopulation.js";
import Course from "./models/studentModels/Course.js";
import Student from "./models/adminModels/Student.js";
import Staff from "./models/adminModels/Staff.js";
import ExamData from "./models/adminModels/ExamData.js";
import Result from "./models/adminModels/Result.js";

// Import all default data
import announcementData from "./defaultData/defaultAnnouncement.js";
import classPopulationData from "./defaultData/defaultClassPopulation.js";
import courseData from "./defaultData/defaultCourses.js";
import studentData from "./defaultData/defaultStudent.js";
import staffData from "./defaultData/defaultStaff.js";
import examData from "./defaultData/defaultExamTimetable.js";
import resultData from "./defaultData/defaultResults.js";
import studentAttendanceData from "./defaultData/defaultStudentAttendance.js";
import staffAttendanceData from "./defaultData/defaultStaffAttendance.js";
import assignmentData from "./defaultData/defaultAssignment.js";

// 👇 Disable foreign key checks, sync, then re-enable
const seedDatabase = async () => {
  try {
    console.log("Disabling foreign key checks...");
    await sequelize.query('PRAGMA foreign_keys = OFF;');

    await sequelize.sync({ force: true }); // Drops all tables
    console.log("Database synced with force: true");

    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log("Foreign key checks re-enabled");

    // Now seed the database...
    await Promise.all(studentData.map(student => Student.create(student)));
    console.log("Student data seeded successfully!");

    await Promise.all(staffData.map(staff => Staff.create(staff)));
    console.log("Staff data seeded successfully!");

    for (const attendance of studentAttendanceData) {
      const { date, studentStatus } = attendance;
      for (const { admissionNumber, status } of studentStatus) {
        await StudentAttendance.create({ date, status, admissionNumber });
      }
    }
    console.log("Student attendance data seeded successfully!");

    for (const attendance of staffAttendanceData) {
      await StaffAttendance.create(attendance);
    }
    console.log("Staff attendance data seeded successfully!");

    await Promise.all(assignmentData.map(assignment => Assignment.create(assignment)));
    console.log("Assignment data seeded successfully!");

    await Promise.all(announcementData.map(announcement => Announcement.create(announcement)));
    console.log("Announcement data seeded successfully!");

    await Promise.all(classPopulationData.map(entry => ClassPopulation.create(entry)));
    console.log("Class population data seeded successfully!");

    await Promise.all(courseData.map(course => Course.create(course)));
    console.log("Course data seeded successfully!");

    await Promise.all(examData.map(exam => ExamData.create(exam)));
    console.log("Exam data seeded successfully!");

    await Promise.all(resultData.map(result => Result.create(result)));
    console.log("Result data seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
