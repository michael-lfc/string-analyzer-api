// import express from 'express';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import countryRoutes from './src/routes/countryRoutes.js';
// import statusRoute from './src/routes/statusRoute.js';
// import { sequelize } from './src/config/db.js';

// dotenv.config();

// const app = express();
// app.use(express.json());

// // ✅ Ensure cache folder exists
// const cacheDir = process.env.CACHE_DIR || './cache';
// if (!fs.existsSync(cacheDir)) {
//   fs.mkdirSync(cacheDir, { recursive: true });
//   console.log(`✅ Cache folder created at ${cacheDir}`);
// }

// // Connect to MySQL via Sequelize and start server after DB is ready
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connected successfully');

//     // Sync all models (create/update tables)
//     await sequelize.sync({ alter: true });
//     console.log('✅ Database synced successfully');

//     // Routes
//     app.use('/countries', countryRoutes);
//     app.use('/status', statusRoute);

//     // Root endpoint
//     app.get('/', (req, res) => {
//       res.json({ message: 'Country Currency & Exchange API' });
//     });

//     // Generic error handler
//     app.use((err, req, res, next) => {
//       console.error(err);
//       if (!res.headersSent) {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     });

//     // Start server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   } catch (err) {
//     console.error('❌ Unable to connect to database:', err);
//     process.exit(1);
//   }
// })();


// import express from 'express';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import countryRoutes from './src/routes/countryRoutes.js';
// import statusRoute from './src/routes/statusRoute.js';
// import { sequelize } from './src/config/db.js';

// dotenv.config();

// const app = express();
// app.use(express.json());

// // ✅ Ensure cache folder exists
// const cacheDir = process.env.CACHE_DIR || './cache';
// if (!fs.existsSync(cacheDir)) {
//   fs.mkdirSync(cacheDir, { recursive: true });
//   console.log(`✅ Cache folder created at ${cacheDir}`);
// }

// // Connect to MySQL via Sequelize and start server after DB is ready
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connected successfully');

//     // ⚠️ TEMPORARY FIX: drop & recreate tables to avoid "Too many keys" error
//     await sequelize.sync({ force: true });
//     console.log('✅ Database synced successfully (force: true)');

//     // Routes
//     app.use('/countries', countryRoutes);
//     app.use('/status', statusRoute);

//     // Root endpoint
//     app.get('/', (req, res) => {
//       res.json({ message: 'Country Currency & Exchange API' });
//     });

//     // Generic error handler
//     app.use((err, req, res, next) => {
//       console.error(err);
//       if (!res.headersSent) {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     });

//     // Start server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   } catch (err) {
//     console.error('❌ Unable to connect to database:', err);
//     process.exit(1);
//   }
// })();

import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import countryRoutes from './src/routes/countryRoutes.js';
import statusRoute from './src/routes/statusRoute.js';
import { sequelize } from './src/config/db.js';

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Ensure cache folder exists
const cacheDir = process.env.CACHE_DIR || './cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log(`✅ Cache folder created at ${cacheDir}`);
}

// Connect to MySQL via Sequelize and start server after DB is ready
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // ⚡ Safe table syncing: update tables without dropping existing data
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully (alter: true)');

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
  } catch (err) {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  }
})();

