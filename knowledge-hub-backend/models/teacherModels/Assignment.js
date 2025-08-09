import { DataTypes } from "sequelize";
import sequelize from '../../config/sequelize.js';


const Assignment = sequelize.define("Assignment", {
  class: {
    type: DataTypes.STRING, // Class name (e.g., "JSS1", "JSS2")
    allowNull: false,
  },
  tasks: {
    type: DataTypes.JSON, // Store tasks as JSON
    allowNull: false,
  },
});

export default Assignment;