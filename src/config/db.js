// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// const {
//   DB_NAME = "country_currency_db",
//   DB_USER = "root",
//   DB_PASSWORD = "",
//   DB_HOST = "localhost",
//   DB_DIALECT = "mysql"
// } = process.env;

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: DB_DIALECT,
//   logging: false
// });

// Create Sequelize instance
export const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Database username
  process.env.DB_PASSWORD,   // Database password
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,          // Disable SQL query logging
    define: {
      timestamps: false      // Disable automatic createdAt/updatedAt
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");
  } catch (err) {
    console.error("❌ Unable to connect to MySQL:", err);
    throw err;
  }
};

export default sequelize;
