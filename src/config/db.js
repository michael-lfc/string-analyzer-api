// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Database username
  process.env.DB_PASSWORD,   // Database password
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',

    logging: false,          // Disable SQL query logging
    define: {
      timestamps: false      // Disable automatic createdAt/updatedAt
    }
  }
);


export default sequelize;
