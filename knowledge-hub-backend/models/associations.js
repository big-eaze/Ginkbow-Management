
import sequelize from "../config/sequelize.js";
import Student from "./adminModels/Student.js";
import Result from "./adminModels/Result.js"; // ✅ Add this
import StudentAttendance from "./adminModels/studentAttendance.js";

// Initialize models
const models = {
  Student,
  Result, // ✅ Include here too
  StudentAttendance,
};

// Run associate method on each model (if defined)
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;
