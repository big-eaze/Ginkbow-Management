import { DataTypes } from "sequelize";
import sequelize from '../../config/sequelize.js';

const Course = sequelize.define("Course", {
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfCourses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Course;