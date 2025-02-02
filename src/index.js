const core = require('@actions/core');
const path = require('path');
const { fetchWakapiUserStats } = require('./utils/wakapiClient');
const { ensureDataDir, saveJson, saveChart } = require('./utils/fileSystem');
const { createRadarChart } = require('./charts/radarChart');
const { createBarChart } = require('./charts/barChart');
const { config } = require('./config');

async function run() {
  try {
    // Get inputs from environment variables with fallback to config
    const apiKey = process.env.WAKAPI_TOKEN || config.wakapiToken;
    const username = process.env.WAKAPI_USERNAME || config.wakapiUsername;
    const intervals = ['all_time', 'last_7_days'];

    // Fetch data for all intervals
    const data = await fetchWakapiUserStats(apiKey, username, intervals);
    const dataDir = ensureDataDir(path.join(__dirname, '..'));

    // Save JSON data for each interval
    for (const interval of intervals) {
      const jsonPath = path.join(dataDir, `wakapi-stats-${interval}.json`);
      saveJson(jsonPath, data[interval]);
      console.log(`Saved Wakapi statistics for ${interval} to data/wakapi-stats-${interval}.json`);
    }

    // Generate and save combined radar charts and bar charts
    const chartFields = ['projects', 'languages'];
    for (const field of chartFields) {
      // Create datasets array with period information
      const datasets = intervals.map(interval => ({
        period: interval,
        data: data[interval].data
      }));

      // Generate combined radar chart
      const canvas = await createRadarChart(datasets, field);
      const radarChartPath = path.join(dataDir, `${field}-radar.png`);
      saveChart(canvas.toBuffer(), radarChartPath);
      console.log(`Generated combined ${field} radar chart: ${radarChartPath}`);

      // Generate bar chart
      const barChartBuffer = await createBarChart(datasets, field);
      const barChartPath = path.join(dataDir, `${field}-bar.png`);
      saveChart(barChartBuffer, barChartPath);
      console.log(`Generated ${field} bar chart: ${barChartPath}`);
    }

    console.log('Successfully fetched Wakapi statistics and generated charts');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run(); 