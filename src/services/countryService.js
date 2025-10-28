import path from 'path';
import axios from 'axios';
import fs from 'fs';
import Country from '../models/Country.js';
import { generateImageSummary } from '../utils/imageGenerator.js';

const COUNTRIES_API = process.env.COUNTRIES_API;
const EXCHANGE_API = process.env.EXCHANGE_API;
const TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS || '10000', 10);

// Path to fallback JSON (store in your repo, e.g., src/cache/countries.json)
const FALLBACK_COUNTRIES = path.join(process.cwd(), 'src', 'cache', 'countries.json');

// ✅ Automatically create cache folder and file if missing
const cacheDir = path.dirname(FALLBACK_COUNTRIES);
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log(`✅ Cache folder created at ${cacheDir}`);
}
if (!fs.existsSync(FALLBACK_COUNTRIES)) {
  fs.writeFileSync(FALLBACK_COUNTRIES, '[]', 'utf8');
  console.log('✅ Empty countries.json created for fallback');
}

export async function refreshCountries() {
  let countriesData = [];
  let exchangeData = {};

  // 1️⃣ Fetch countries
  try {
    const res = await axios.get(COUNTRIES_API, { timeout: TIMEOUT });
    countriesData = res.data;
    if (!Array.isArray(countriesData)) throw new Error('Invalid countries data');
  } catch (err) {
    console.warn('Failed to fetch countries API, using fallback JSON:', err.message);
    if (fs.existsSync(FALLBACK_COUNTRIES)) {
      countriesData = JSON.parse(fs.readFileSync(FALLBACK_COUNTRIES, 'utf8'));
    } else {
      const e = new Error('Could not fetch data from countries API and no fallback available');
      e.isExternal = true;
      throw e;
    }
  }

  // 2️⃣ Fetch exchange rates
  try {
    const res = await axios.get(EXCHANGE_API, { timeout: TIMEOUT });
    exchangeData = res.data;
    if (!exchangeData?.rates || typeof exchangeData.rates !== 'object') {
      throw new Error('Invalid exchange rates format');
    }
  } catch (err) {
    console.warn('Failed to fetch exchange API, setting exchange rates to null:', err.message);
    exchangeData.rates = {};
  }

  const rates = exchangeData.rates;

  // 3️⃣ Process each country
  const processedCountries = countriesData.map(c => {
    const name = c.name;
    const capital = c.capital || null;
    const region = c.region || null;
    const population = typeof c.population === 'number' ? c.population : 0;
    const flag_url = c.flag || null;

    let currency_code = null;
    let exchange_rate = null;
    let estimated_gdp = null;

    if (Array.isArray(c.currencies) && c.currencies.length > 0 && c.currencies[0]?.code) {
      currency_code = c.currencies[0].code;
      exchange_rate = rates[currency_code] || null;

      if (exchange_rate) {
        const multiplier = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        estimated_gdp = (population * multiplier) / exchange_rate;
      } else {
        estimated_gdp = null;
      }
    } else {
      currency_code = null;
      exchange_rate = null;
      estimated_gdp = 0;
    }

    return {
      name,
      capital,
      region,
      population,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url,
      last_refreshed_at: new Date()
    };
  });

  // 4️⃣ Upsert countries into DB
  for (const country of processedCountries) {
    await Country.upsert(country);
  }

  // 5️⃣ Generate summary image
  const totalCountries = await Country.count();
  const top5Countries = await Country.findAll({
    order: [['estimated_gdp', 'DESC']],
    limit: 5
  });

  await generateImageSummary({ totalCountries, top5: top5Countries });

  // 6️⃣ Return refresh info
  return {
    message: 'Countries refreshed successfully',
    total_countries: totalCountries,
    last_refreshed_at: new Date()
  };
}