import axios from 'axios';
import Country from '../models/country.js';
import { generateImageSummary } from '../utils/imageGenerator.js';

const COUNTRIES_API = process.env.COUNTRIES_API;
const EXCHANGE_API = process.env.EXCHANGE_API;
const TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS || '10000', 10);

/**
 * Refresh countries from external APIs and update DB
 */
export async function refreshCountries() {
  if (!COUNTRIES_API || !EXCHANGE_API) {
    throw new Error('API URLs not configured in environment');
  }

  // Fetch external APIs in parallel
  let countriesData, exchangeData;
  try {
    const [cRes, eRes] = await Promise.all([
      axios.get(COUNTRIES_API, { timeout: TIMEOUT }),
      axios.get(EXCHANGE_API, { timeout: TIMEOUT })
    ]);
    countriesData = cRes.data;
    exchangeData = eRes.data;

    if (!Array.isArray(countriesData)) {
      throw new Error('Countries API returned invalid data format');
    }
    if (!exchangeData || typeof exchangeData.rates !== 'object') {
      throw new Error('Exchange API returned invalid rates format');
    }
  } catch (err) {
    const errName = err.config?.url || 'external API';
    const e = new Error(`Could not fetch data from ${errName}`);
    e.isExternal = true;
    throw e;
  }

  const rates = exchangeData.rates || {};
  const processedCountries = [];

  for (const c of countriesData) {
    const name = c.name;
    const capital = c.capital || null;
    const region = c.region || null;
    const population = typeof c.population === 'number' ? c.population : 0;
    const flag_url = c.flag || null;

    let currency_code = null;
    let exchange_rate = null;
    let estimated_gdp = 0;

    if (Array.isArray(c.currencies) && c.currencies.length > 0 && c.currencies[0]?.code) {
      currency_code = c.currencies[0].code;
      exchange_rate = rates[currency_code] || null;

      if (exchange_rate) {
        const multiplier = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        estimated_gdp = (population * multiplier) / exchange_rate;
      } else {
        estimated_gdp = null;
      }
    }

    processedCountries.push({
      name,
      capital,
      region,
      population,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url,
      last_refreshed_at: new Date()
    });
  }

  // Upsert countries into MySQL
  for (const country of processedCountries) {
    await Country.upsert(country); // matches by primary key or unique constraint (name)
  }

  // Prepare data for image
  const totalCountries = await Country.count();
  const top5Countries = await Country.findAll({
    order: [['estimated_gdp', 'DESC']],
    limit: 5
  });

  await generateImageSummary({ totalCountries, top5: top5Countries });

  return {
    message: 'Countries refreshed successfully',
    total_countries: totalCountries,
    last_refreshed_at: new Date()
  };
}
