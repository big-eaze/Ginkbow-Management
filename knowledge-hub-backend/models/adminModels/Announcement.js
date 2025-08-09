import { DataTypes } from "sequelize";
import sequelize from '../../config/sequelize.js';

const Announcement = sequelize.define("Announcement", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING, // Store date as a string (e.g., "DD/MM/YYYY")
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING, // Store time as a string (e.g., "HH:MM AM/PM")
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // Store detailed content
    allowNull: false,
  },
  receiver: {
    type: DataTypes.STRING, // e.g., "staff", "students"
    allowNull: false,
  },
});

export default Announcement;