import { DataTypes } from "sequelize";
import sequelize from '../../config/sequelize.js';

const ExamData = sequelize.define("ExamData", {
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exams: {
    type: DataTypes.JSON, // Store exams as JSON
    allowNull: false,
  },
});

export default ExamData;