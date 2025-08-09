import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const StudentAttendance = sequelize.define("StudentAttendance", {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("present", "absent", "late"),
    allowNull: false,
  },
  admissionNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Students", // Use the model name as a string
      key: "admissionNumber",
    },
  },
});

// Define associations dynamically

StudentAttendance.associate = (models) => {
  StudentAttendance.belongsTo(models.Student, {
    foreignKey: 'admissionNumber',
    targetKey: 'admissionNumber',
    as: 'student',
    onDelete: 'CASCADE',
  });
};

export default StudentAttendance;