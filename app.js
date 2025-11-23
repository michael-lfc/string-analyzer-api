<<<<<<< HEAD
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import countryRoutes from './src/routes/countryRoutes.js';
import statusRoute from './src/routes/statusRoute.js';
import { sequelize } from './src/config/db.js';
import stringRoutes from './routes/stringRoutes.js';
import { connectDB } from './db.js';
=======
// app.js
import express from "express";
import dotenv from "dotenv";
import stringRoutes from "./routes/stringRoutes.js";
import { connectDB } from "./db.js";
>>>>>>> 7cac3084d0dc0b2e2eccb09bd36719c1b7954bac

dotenv.config();

const app = express();
<<<<<<< HEAD
app.use(express.json());

// ✅ Ensure cache folder exists
const cacheDir = process.env.CACHE_DIR || './cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log(`✅ Cache folder created at ${cacheDir}`);
}

// Connect to both databases and start server
(async () => {
  try {
    // MySQL
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL synced successfully (alter: true)');

    // MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Routes
    app.use('/countries', countryRoutes);
    app.use('/status', statusRoute);
    app.use('/strings', stringRoutes);

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ message: 'Server is running!' });
    });

    // Generic error handler
    app.use((err, req, res, next) => {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (err) {
    console.error('❌ Unable to connect to databases:', err);
    process.exit(1);
  }
})();
=======

// Connect to MongoDB
connectDB();

app.use(express.json()); // parse JSON request bodies

app.get("/", (req, res) => {
  res.send("✅ String Analyzer API is running...");
});

app.use("/strings", stringRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 7cac3084d0dc0b2e2eccb09bd36719c1b7954bac
