const core = require('@actions/core');
const path = require('path');
const { fetchWakapiStats, fetchWakapiUserStats } = require('./utils/wakapiClient');
const { ensureDataDir, saveJson, saveChart } = require('./utils/fileSystem');
const { createBarChart } = require('./charts/barChart');
const { createRadarChart } = require('./charts/radarChart');
const { config } = require('./config');

async function run() {
  try {
    // Get inputs from environment variables with fallback to config
    const apiKey = process.env.WAKAPI_TOKEN || config.wakapiToken;
    const username = process.env.WAKAPI_USERNAME || config.wakapiUsername;
    const intervals = ['all_time', 'last_7_days', 'today'];

    // Fetch data for all intervals
    const data = await fetchWakapiUserStats(apiKey, username, intervals);
    const dataDir = ensureDataDir(path.join(__dirname, '..'));

    // Save JSON data for each interval
    for (const interval of intervals) {
      const jsonPath = path.join(dataDir, `wakapi-stats-${interval}.json`);
      saveJson(jsonPath, data[interval]);
      console.log(`Saved Wakapi statistics for ${interval} to data/wakapi-stats-${interval}.json`);
    }

    // Generate and save combined radar charts
    const radarChartFields = ['projects', 'languages'];
    for (const field of radarChartFields) {
      // Create datasets array with period information
      const datasets = intervals.map(interval => ({
        period: interval,
        data: data[interval].data
      }));

      // Generate combined chart
      const canvas = await createRadarChart(datasets, field);
      const chartPath = path.join(dataDir, `${field}.png`);
      saveChart(canvas.toBuffer(), chartPath);
      console.log(`Generated combined ${field} chart: ${chartPath}`);
    }

    console.log('Successfully fetched Wakapi statistics and generated charts');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run(); 