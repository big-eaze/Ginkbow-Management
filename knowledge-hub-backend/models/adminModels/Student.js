import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';
import StudentAttendance from "./studentAttendance.js"; // Import the StudentAttendance model

const Student = sequelize.define('Student', {
  admissionNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true, // Set admissionNumber as the primary key
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parentPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{12}$/, // Validates exactly 12-digit phone numbers
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});


Student.associate = (models) => {
  Student.hasMany(models.Result, {
    foreignKey: 'admissionNumber',
    sourceKey: 'admissionNumber',
    as: 'results',
    onDelete: 'CASCADE', 
  });

  Student.hasMany(models.StudentAttendance, {
    foreignKey: 'admissionNumber',
    sourceKey: 'admissionNumber',
    as: 'attendanceRecords',
    onDelete: 'CASCADE', 
  });
};


export default Student;