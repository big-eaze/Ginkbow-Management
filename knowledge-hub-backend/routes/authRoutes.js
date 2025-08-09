import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import fs from "fs";
import nodemailer from "nodemailer";


import User from "../models/User.js";
import OTP from "../models/OTP.js";
import Student from "../models/adminModels/Student.js";
import Staff from "../models/adminModels/Staff.js";
import adminIds from "../defaultData/defaultAdmin.js";
import authMiddleware from "../middleware/authMiddleware.js";

const config = JSON.parse(fs.readFileSync(new URL("../config/config.json", import.meta.url)));
const JWT_SECRET = config.JWT_SECRET;

const router = express.Router();


// --- Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// ==========================
// ✅ Public Routes
// ==========================

// POST /signup

router.post(
  "/signup",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("role")
      .notEmpty()
      .isIn(["admin", "staff", "student"])
      .withMessage("Invalid role"),

    // Email required only for staff and admin
    body("email")
      .if(body("role").custom(role => role === "admin" || role === "staff"))
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords do not match");
      return true;
    }),

    body("adminId")
      .if(body("role").equals("admin"))
      .notEmpty()
      .withMessage("Admin ID is required"),

    body("staffId")
      .if(body("role").equals("staff"))
      .notEmpty()
      .withMessage("Staff ID is required"),
    body("class")
      .if(body("role").equals("staff"))
      .notEmpty()
      .withMessage("Class is required for staff"),
    body("subject")
      .if(body("role").equals("staff"))
      .notEmpty()
      .withMessage("Subject is required for staff"),
    body("admissionNumber")
      .if(body("role").equals("student"))
      .notEmpty()
      .withMessage("Admission number is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      adminId,
      staffId,
      admissionNumber,
      class: staffClass,
      subject,
    } = req.body;

    try {
      if (role === "admin" && !adminIds.some(admin => admin.adminId === adminId)) {
        return res.status(400).json({ message: "Invalid admin ID" });
      }

      if (role === "staff") {
        const staffExists = await Staff.findOne({ where: { staffId } });
        if (!staffExists)
          return res
            .status(400)
            .json({ message: "Staff ID not found in staff database" });
      }

      if (role === "student") {
        const studentExists = await Student.findOne({
          where: { admissionNumber },
        });
        if (!studentExists)
          return res.status(400).json({
            message: "Admission number not found in student database",
          });
      }

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername)
        return res.status(400).json({ message: "Username already exists" });

      if (email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail)
          return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        username,
        email: email || null,
        password: hashedPassword,
        role,
        adminId: role === "admin" ? adminId : null,
        staffId: role === "staff" ? staffId : null,
        admissionNumber: role === "student" ? admissionNumber : null,
        class: role === "staff" ? staffClass : null,
        subject: role === "staff" ? subject : null,
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          role: newUser.role,
          adminId: newUser.adminId,
          staffId: newUser.staffId,
          admissionNumber: newUser.admissionNumber,
          class: newUser.class,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Server error during signup", error: error.message });
    }
  }
);


// POST /signin
router.post(
  "/signin",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          adminId: user.adminId,
          staffId: user.staffId,
          admissionNumber: user.admissionNumber,
          class: user.role === "student" ? user.class : null,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// POST /forgot-password
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Enter a valid email")],
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = Math.floor(100000 + Math.random() * 900000);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await OTP.create({ email, otp, expiresAt });

      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 30 minutes.`,
      });

      res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// POST /reset-password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters"),
    body("confirmNewPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("New passwords do not match");
      return true;
    }),
  ],
  async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
      const otpRecord = await OTP.findOne({ where: { email, otp } });
      if (!otpRecord)
        return res.status(400).json({ message: "Invalid OTP" });

      if (new Date() > otpRecord.expiresAt) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      await otpRecord.destroy();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==========================
// ✅ Protected Routes (after authMiddleware)
// ==========================
router.use(authMiddleware);

// GET /profile
// GET /profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Dynamically inject class if the user is a student
    if (user.role === "student" && user.admissionNumber) {
      const student = await Student.findOne({
        where: { admissionNumber: user.admissionNumber },
        attributes: ["class"],
      });

      if (student) {
        user.dataValues.class = student.class; // add class to user object
      }
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// POST /change-password
router.post(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),
    body("confirmNewPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("New passwords do not match");
      return true;
    }),
  ],
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
