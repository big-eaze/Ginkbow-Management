import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Staff = sequelize.define('Staff', {
  staffId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{11}$/, // Validates 11-digit phone numbers
    },
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default Staff;