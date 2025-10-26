import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

/**
 * Generates a summary image showing total countries and top 5 by estimated GDP
 * @param {Array} countries - Array of top countries
 * @returns {string|null} - Path to generated image or null if failed
 */
export async function generateImageSummary(countries) {
  try {
    const totalCountries = countries.totalCountries ?? 0;
    const top5 = countries.top5 ?? [];

    // Create summary text
    const summaryText = [
      `Total Countries: ${totalCountries}`,
      'Top 5 by GDP:',
      ...top5.map((c, i) => `${i + 1}. ${c.name} — ${c.estimated_gdp?.toFixed(2) ?? 0}`)
    ].join('\n');

    // Use a placeholder image API
    const imageUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${encodeURIComponent(summaryText.slice(0, 50))}`;

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to generate image');

    // Ensure cache directory exists
    const cacheDir = path.join(process.cwd(), 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imagePath = path.join(cacheDir, 'summary.png');
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));

    console.log('✅ Summary image generated:', imagePath);
    return imagePath;
  } catch (error) {
    console.error('❌ Image generation failed:', error.message);
    return null;
  }
}
