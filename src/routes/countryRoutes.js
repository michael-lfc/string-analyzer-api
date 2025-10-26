import express from 'express';
import {
  refresh,
  getCountries,
  getCountryByName,
  deleteCountry,
  getSummaryImage
} from '../controllers/countryController.js';

const router = express.Router();

// Refresh all data and generate summary image
router.post('/refresh', refresh);

// Get all countries
router.get('/', getCountries);

// Get summary image (✅ must come before /:name)
router.get('/image', getSummaryImage);

// Get single country by name
router.get('/:name', getCountryByName);

// Delete a country
router.delete('/:name', deleteCountry);

export default router;
