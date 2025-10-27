import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas'; // lightweight image generation

/**
 * Generates a summary image showing total countries and top 5 by estimated GDP
 * @param {Object} data
 * @param {number} data.totalCountries - Total countries in DB
 * @param {Array} data.top5 - Top 5 countries by estimated GDP
 * @returns {string|null} - Path to generated image
 */
export async function generateImageSummary({ totalCountries, top5 }) {
  try {
    // Canvas setup
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('Country Summary', 50, 50);

    // Total countries
    ctx.font = '24px Arial';
    ctx.fillText(`Total Countries: ${totalCountries}`, 50, 120);

    // Top 5 GDP countries
    ctx.fillText('Top 5 by GDP:', 50, 180);
    top5.forEach((c, i) => {
      const gdpText = c.estimated_gdp
        ? c.estimated_gdp.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : 'N/A';
      ctx.fillText(`${i + 1}. ${c.name} — GDP: ${gdpText}`, 70, 220 + i * 40);
    });

    // Ensure cache folder exists
    const cacheDir = path.join(process.cwd(), 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imagePath = path.join(
      process.cwd(),
      process.env.CACHE_DIR || './cache',
       process.env.SUMMARY_IMAGE || 'summary.png'
    );

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    console.log('✅ Summary image generated:', imagePath);
    return imagePath;
  } catch (err) {
    console.error('❌ Failed to generate summary image:', err.message);
    return null;
  }
}
