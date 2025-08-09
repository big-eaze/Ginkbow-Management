import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const User = sequelize.define("User", {
  role: {
    type: DataTypes.ENUM("admin", "staff", "student"),
    allowNull: false,
  },
  adminId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  staffId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  admissionNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
