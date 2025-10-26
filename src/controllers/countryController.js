import Country from "../models/country.js";
import { refreshCountries } from '../services/countryService.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

/**
 * POST /countries/refresh
 * Refresh all countries from external APIs and generate summary image
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
 * Optional query: ?region=Africa&currency=NGN&sort=gdp_desc&page=1&limit=100
 */
export async function getCountries(req, res) {
  try {
    const { region, currency, sort, limit = 100, page = 1 } = req.query;
    const where = {};
    if (region) where.region = region;
    if (currency) where.currency_code = currency;

    const perPage = Math.min(parseInt(limit, 10) || 100, 1000);
    const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;

    const order = [];
    if (sort === 'gdp_desc') order.push(['estimated_gdp', 'DESC']);
    if (sort === 'gdp_asc') order.push(['estimated_gdp', 'ASC']);

    const countries = await Country.findAll({
      where,
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
      where: { name: { [Op.like]: name } }
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
      where: { name: { [Op.like]: name } }
    });

    if (deletedCount === 0)
      return res.status(404).json({ error: 'Country not found' });

    res.json({ message: 'Country deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /status
 * Returns total countries and last refresh timestamp
 */
export async function getStatus(req, res) {
  try {
    const totalCountries = await Country.count();
    const lastCountry = await Country.findOne({
      order: [['last_refreshed_at', 'DESC']]
    });

    res.json({
      total_countries: totalCountries,
      last_refreshed_at: lastCountry?.last_refreshed_at || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /countries/image
 * Serves the cached summary image if it exists
 */
export async function getSummaryImage(req, res) {
  const imagePath = path.join(process.cwd(), 'cache', 'summary.png');

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Summary image not found' });
  }

  res.sendFile(imagePath);
}

