const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, '..', 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Define the placeholder
const placeholder = '<!-- README STATS -->';

// Define GitHub Stats Tables
const githubStats = `
<table cellspacing="0" cellpadding="0" style="border-collapse: separate; border-spacing: 8px; width: 100%; background: transparent;">
  <tr style="background: transparent;">
    <td width="25%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/contributions-card.svg" alt="Contributions" width="100%">
    </td>
    <td width="25%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/prs-card.svg" alt="Pull Requests" width="100%">
    </td>
    <td width="25%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/stars-card.svg" alt="Stars" width="100%">
    </td>
    <td width="25%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/forks-card.svg" alt="Forks" width="100%">
    </td>
  </tr>
</table>
`;

// Define WAKAPI Stats Tables
const wakapiStats = `
<table cellspacing="0" cellpadding="0" style="border-collapse: separate; border-spacing: 8px; width: 100%; background: transparent;">
  <tr style="background: transparent;">
    <td width="100%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/traffic-chart.svg" alt="Daily Average Hours" width="100%">
    </td>
  </tr>
</table>

<table cellspacing="0" cellpadding="0" style="border-collapse: separate; border-spacing: 8px; width: 100%; background: transparent;">
  <tr style="background: transparent;">
    <td width="50%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/all_time-coding-stats.svg" alt="Daily Average Hours" width="100%">
    </td>
    <td width="50%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/last_7_days-coding-stats.svg" alt="Total Hours" width="100%">
    </td>
  </tr>

  <tr style="background: transparent;">
    <td width="50%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <h3 style="color: #7c848c;">Projects</h3>
      <img src="/../../raw/data/data/projects-radar.svg" alt="Time Spent by Project" width="100%">
    </td>
    <td width="50%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <h3 style="color: #7c848c;">Languages</h3>
      <img src="/../../raw/data/data/languages-radar.svg" alt="Time Spent by Language" width="100%">
    </td>
  </tr>

  <tr style="background: transparent;">
    <td width="50%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/projects-bar.svg" alt="Time Spent by Project (Bar)" width="100%">
    </td>
    <td width="50%" align="center" style="background: transparent; border: 1px solid #7c848c; border-radius: 5px;">
      <img src="/../../raw/data/data/languages-bar.svg" alt="Time Spent by Language (Bar)" width="100%">
    </td>
  </tr>
</table>
`;

// Check for WAKAPI secrets
const wakapiEnabled = process.env.WAKAPI_TOKEN && process.env.WAKAPI_USERNAME;

// Construct the stats section
let statsSection = githubStats;

if (wakapiEnabled) {
  statsSection += wakapiStats;
}

// Replace the placeholder with the stats section
readmeContent = readmeContent.replace(placeholder, statsSection);

// Write the updated README back to the file system
fs.writeFileSync(readmePath, readmeContent, 'utf8'); 