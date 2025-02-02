const { CODING_STATS_BIG_FONT_SIZE, CODING_STATS_MEDIUM_FONT_SIZE, FONT_FAMILY, FONT_SIZE, GITHUB_BLACK, GITHUB_LIGHT_GREEN, GITHUB_WHITE, GITHUB_NEUTRAL_GREEN, GITHUB_DARK_GREEN, GITHUB_LIGHT_GRAY, GITHUB_NEUTRAL_GRAY, GITHUB_DARK_GRAY } = require('./configs');


exports.createStatsCard = async function createStatsCard({ title, totalHours, dailyAverage, period }) {
  const width = 400;
  const height = 100;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Border -->
      <rect width="${width-1}" height="${height-1}" stroke="${GITHUB_LIGHT_GRAY}" fill="transparent" rx="5" ry="5"/>
      
      <!-- Title -->
      <text 
        x="50%" 
        y="27"
        text-anchor="middle" 
        font-family="${FONT_FAMILY}" 
        font-size="${CODING_STATS_MEDIUM_FONT_SIZE}" 
        font-weight="bold" 
        fill="${GITHUB_WHITE}"

      >${title}</text>

      <!-- Total Hours -->
      <text 
        x="5%" 
        y="55" 
        text-anchor="start" 
        font-family="${FONT_FAMILY}" 
        font-size="${FONT_SIZE}" 
        fill="${GITHUB_LIGHT_GRAY}"
      >Total Hours:</text>


      <text 
        x="95%" 
        y="55" 
        text-anchor="end" 
        font-family="${FONT_FAMILY}" 
        font-size="${CODING_STATS_BIG_FONT_SIZE}" 
        font-weight="bold" 
        fill="${GITHUB_WHITE}"

      >${totalHours}</text>

      <!-- Daily Average -->
      <text 
        x="5%" 
        y="75" 
        text-anchor="start" 
        font-family="${FONT_FAMILY}" 
        font-size="${FONT_SIZE}" 
        fill="${GITHUB_LIGHT_GRAY}"
      >Daily Average:</text>


      <text 
        x="95%" 
        y="75" 
        text-anchor="end" 
        font-family="${FONT_FAMILY}" 
        font-size="${CODING_STATS_MEDIUM_FONT_SIZE}" 
        font-weight="bold" 
        fill="${GITHUB_LIGHT_GREEN}"
      >${dailyAverage}</text>
    </svg>
  `;

  return Buffer.from(svg);
}
