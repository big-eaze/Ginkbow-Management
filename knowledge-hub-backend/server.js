import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/sequelize.js';
import staffRoutes from './routes/staffRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import examRoutes from "./routes/examRoutes.js";
import classPopulationRoutes from './routes/classPopulationRoutes.js';
import announcementRoutes from "./routes/announcementRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import staffAttendanceRoutes from "./routes/staffAttendanceRoutes.js";
import studentAttendanceRoutes from "./routes/studentAttendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "./models/associations.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/staff', staffRoutes);
app.use('/students', studentRoutes);
app.use('/results', resultRoutes);
app.use('/class-population', classPopulationRoutes);
app.use("/exam-timetable", examRoutes);
app.use("/announcements", announcementRoutes);
app.use("/courses", courseRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/staff-attendance", staffAttendanceRoutes);
app.use("/student-attendance", studentAttendanceRoutes);
app.use("/auth", authRoutes);



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Start server after syncing DB
sequelize.sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Database sync error:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
