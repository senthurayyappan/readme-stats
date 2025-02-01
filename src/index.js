const core = require('@actions/core');
const path = require('path');
const { fetchWakapiStats } = require('./utils/wakapiClient');
const { ensureDataDir, saveJson, saveChart } = require('./utils/fileSystem');
const { createBarChart } = require('./charts/barChart');
const { createLanguageRadarChart } = require('./charts/radarChart');
const { config } = require('./config');

async function run() {
  try {
    // Get inputs from environment variables with fallback to config
    const apiKey = process.env.WAKAPI_TOKEN || config.wakapiToken;
    const interval = process.env.INTERVAL || config.interval;

    // Fetch data
    const data = await fetchWakapiStats(apiKey, interval);

    // Prepare directory
    const dataDir = ensureDataDir(path.join(__dirname, '..'));

    // Save JSON data
    const jsonPath = path.join(dataDir, 'wakapi-stats.json');
    saveJson(jsonPath, data);
    console.log('Saved Wakapi statistics to data/wakapi-stats.json');

    // Generate and save bar charts
    const barChartFields = ['projects', 'operating_systems', 'machines'];
    for (const field of barChartFields) {
      const canvas = await createBarChart(data, field);
      const chartPath = path.join(dataDir, `${field}-chart.png`);
      saveChart(canvas.toBuffer(), chartPath);
      console.log(`Generated chart: ${chartPath}`);
    }

    // Generate and save language radar chart
    const languageCanvas = await createLanguageRadarChart(data);
    const languageChartPath = path.join(dataDir, 'languages-chart.png');
    saveChart(languageCanvas.toBuffer(), languageChartPath);
    console.log('Generated language radar chart');

    console.log('Successfully fetched Wakapi statistics and generated charts');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run(); 