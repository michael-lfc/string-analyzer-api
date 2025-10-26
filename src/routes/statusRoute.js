import express from 'express';
import { getStatus } from '../controllers/countryController.js';

const router = express.Router();

// 🟠 Server health/status endpoint
router.get('/', getStatus);

export default router;
