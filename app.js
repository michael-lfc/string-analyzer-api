import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs'
import countryRoutes from './src/routes/countryRoutes.js';
import statusRoute from './src/routes/statusRoute.js';
import { sequelize } from './src/config/db.js';

dotenv.config();

// ✅ Ensure cache folder exists before any other code
if (!fs.existsSync(process.env.CACHE_DIR)) {
  fs.mkdirSync(process.env.CACHE_DIR, { recursive: true });
}


const app = express();
app.use(express.json());

// Connect to MySQL via Sequelize
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    // Optional: sync models (create tables if they don't exist)
    await sequelize.sync(); 
  } catch (err) {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  }
})();

// Routes
app.use('/countries', countryRoutes);
app.use('/status', statusRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Country Currency & Exchange API' });
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
