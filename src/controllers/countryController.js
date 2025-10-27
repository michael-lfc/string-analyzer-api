import Country from '../models/Country.js';
import { refreshCountries } from '../services/countryService.js';
import { Op, where, fn, col } from 'sequelize';
import fs from 'fs';
import path from 'path';

/**
 * POST /countries/refresh
 */
export async function refresh(req, res) {
  try {
    const result = await refreshCountries();
    res.json(result);
  } catch (err) {
    if (err.isExternal) {
      return res.status(503).json({
        error: 'External data source unavailable',
        details: err.message
      });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /countries
 */
export async function getCountries(req, res) {
  try {
    const { region, currency, sort, limit = 100, page = 1 } = req.query;

    const whereClause = {};
    if (region) {
      // Case-insensitive region filter
      whereClause.region = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('region')),
        region.toLowerCase()
      );
    }
    if (currency) {
      // Case-insensitive currency filter
      whereClause.currency_code = sequelize.where(
        sequelize.fn('LOWER', sequelize.col('currency_code')),
        currency.toLowerCase()
      );
    }

    const perPage = Math.min(parseInt(limit, 10) || 100, 1000);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;

    const order = [];
    if (sort === 'gdp_desc') order.push(['estimated_gdp', 'DESC']);
    if (sort === 'gdp_asc') order.push(['estimated_gdp', 'ASC']);

    const countries = await Country.findAll({
      where: whereClause,
      order,
      limit: perPage,
      offset
    });

    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * GET /countries/:name
 */
export async function getCountryByName(req, res) {
  try {
    const { name } = req.params;

    const country = await Country.findOne({
      where: where(fn('LOWER', col('name')), name.toLowerCase())
    });

    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json(country);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /countries/:name
 */
export async function deleteCountry(req, res) {
  try {
    const { name } = req.params;

    const deletedCount = await Country.destroy({
      where: where(fn('LOWER', col('name')), name.toLowerCase())
    });

    if (deletedCount === 0)
      return res.status(404).json({ error: 'Country not found' });

    res.json({ message: 'Country deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /status
 */
export async function getStatus(req, res) {
  try {
    const totalCountries = await Country.count();
    const lastCountry = await Country.findOne({
      order: [['last_refreshed_at', 'DESC']]
    });

    res.json({
      total_countries: totalCountries,
      last_refreshed_at: lastCountry?.last_refreshed_at
        ? lastCountry.last_refreshed_at.toISOString()
        : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * GET /countries/image
 */
export async function getSummaryImage(req, res) {
  try {
    const imagePath = path.resolve(process.cwd(), 'cache', 'summary.png');

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Summary image not found' });
    }

    res.sendFile(imagePath, err => {
      if (err) {
        console.error('Error sending image:', err.message);
        res.status(500).json({ error: 'Failed to send summary image' });
      }
    });
  } catch (err) {
    console.error('Unexpected error serving image:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
