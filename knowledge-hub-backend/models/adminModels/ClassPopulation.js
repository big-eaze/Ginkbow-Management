import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const ClassPopulation = sequelize.define('ClassPopulation', {
  class: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure each class is unique
  },
  numberOfStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default ClassPopulation;