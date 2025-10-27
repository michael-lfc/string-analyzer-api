import Country from "../models/Country.js";
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

    // 1️⃣ Fetch data from external API if needed
    const response = await fetch(process.env.COUNTRIES_API);
    const allCountries = await response.json();

    // 2️⃣ Filter only the fields you want
    const filteredCountries = allCountries.map(
      ({ name, capital, region, population, flag, currencies }) => ({
        name,
        capital,
        region,
        population,
        flag,
        currency_code: currencies?.[0]?.code || null
      })
    );

    // 3️⃣ Apply query filters
    let results = filteredCountries;
    if (region) results = results.filter(c => c.region === region);
    if (currency) results = results.filter(c => c.currency_code === currency);

    // 4️⃣ Sort results
    if (sort === "gdp_desc") results.sort((a, b) => b.estimated_gdp - a.estimated_gdp);
    if (sort === "gdp_asc") results.sort((a, b) => a.estimated_gdp - b.estimated_gdp);

    // 5️⃣ Pagination
    const perPage = Math.min(parseInt(limit, 10) || 100, 1000);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const paginated = results.slice((pageNum - 1) * perPage, pageNum * perPage);

    res.json(paginated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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

