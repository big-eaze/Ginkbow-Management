import { DataTypes } from "sequelize";
import sequelize from '../../config/sequelize.js';

const StaffAttendance = sequelize.define("StaffAttendance", {
  date: {
    type: DataTypes.DATEONLY, // Stores the date in YYYY-MM-DD format
    allowNull: false,
  },
  staffStatus: {
    type: DataTypes.JSON, // Stores the staff attendance status as JSON
    allowNull: false,
  },
});

export default StaffAttendance;