const core = require('@actions/core');
const path = require('path');
const { fetchWakapiUserStats } = require('./utils/wakapiClient');
const { ensureDataDir, saveJson, saveChart } = require('./utils/fileSystem');
const { createRadarChart } = require('./charts/radarChart');
const { createBarChart } = require('./charts/barChart');
const { config } = require('./config');
const { createStatsCard } = require('./charts/statsCard');

async function run() {
  try {
    // Get inputs from environment variables with fallback to config
    const apiKey = process.env.WAKAPI_TOKEN || config.wakapiToken;
    const username = process.env.WAKAPI_USERNAME || config.wakapiUsername;
    const intervals = config.intervals;

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
      const radarChartBuffer = await createRadarChart(datasets, field);
      const radarChartPath = path.join(dataDir, `${field}-radar.svg`);
      saveChart(radarChartBuffer, radarChartPath);
      console.log(`Generated combined ${field} radar chart: ${radarChartPath}`);


      // Generate bar chart
      const barChartBuffer = await createBarChart(datasets, field);
      const barChartPath = path.join(dataDir, `${field}-bar.svg`);
      saveChart(barChartBuffer, barChartPath);
      console.log(`Generated ${field} bar chart: ${barChartPath}`);
    }

    // Generate stats cards for both intervals
    for (const interval of intervals) {
      const stats = data[interval].data;
      
      // Generate combined stats card
      const statsBuffer = await createStatsCard({
        title: config.intervalLabels[interval],
        totalHours: stats.human_readable_total,
        dailyAverage: stats.human_readable_daily_average,
        period: stats.human_readable_range

      });
      const statsPath = path.join(dataDir, `${interval}-coding-stats.svg`);
      saveChart(statsBuffer, statsPath);
      console.log(`Generated coding stats card for ${interval}: ${statsPath}`);
    }

    console.log('Successfully fetched Wakapi statistics and generated charts');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run(); 