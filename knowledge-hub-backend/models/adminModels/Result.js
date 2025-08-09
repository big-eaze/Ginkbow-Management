import { DataTypes } from "sequelize";
import sequelize from '../../config/sequelize.js';

const Result = sequelize.define("Result", {
  admissionNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjects: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

Result.associate = (models) => {
  Result.belongsTo(models.Student, {
    foreignKey: 'admissionNumber',
    targetKey: 'admissionNumber',
    as: 'student',
    onDelete: 'CASCADE',
  });
};

export default Result;
