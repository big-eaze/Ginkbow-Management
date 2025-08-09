import { Sequelize } from 'sequelize';

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // SQLite database file
  logging: false, // Disable logging (optional)
});


export default sequelize;
