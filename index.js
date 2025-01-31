const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs').promises;
const path = require('path');
const d3 = require('d3');
const { JSDOM } = require('jsdom');

// Create a virtual DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

async function generatePlots(data, dataDir, interval) {
  // Modern color palette
  const colors = [
    '#2563eb', // blue
    '#db2777', // pink
    '#16a34a', // green
    '#ea580c', // orange
    '#9333ea', // purple
    '#0891b2', // cyan
    '#4f46e5', // indigo
    '#c026d3', // fuchsia
    '#059669', // emerald
    '#dc2626'  // red
  ];

  // Helper function to create SVG string
  const createChart = (width = 800, height = 500) => {
    const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height);
    
    svg.append('g')
      .attr('transform', `translate(40, 20)`); // Add margins

    return svg;
  };

  // Generate bar chart for projects
  const generateBarChart = (data, width = 800, height = 500) => {
    const svg = createChart(width, height);
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([chartHeight, 0]);

    x.domain(data.map(d => d.key));
    y.domain([0, d3.max(data, d => d.total / 3600)]);

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.total / 3600))
      .attr('height', d => chartHeight - y(d.total / 3600))
      .attr('fill', colors[0])
      .attr('rx', 6)
      .attr('ry', 6);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));

    return svg.node().outerHTML;
  };

  // Generate pie chart for languages
  const generatePieChart = (data, width = 800, height = 500) => {
    const svg = createChart(width, height);
    const radius = Math.min(width, height) / 2 - 40;

    const pie = d3.pie()
      .value(d => d.total);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i % colors.length]);

    return svg.node().outerHTML;
  };

  // Generate and save plots
  const plots = {
    'projects': () => generateBarChart(data.projects),
    'languages': () => generatePieChart(data.languages),
    'os': () => generateBarChart(data.operating_systems)
  };

  for (const [name, generatePlot] of Object.entries(plots)) {
    const svgString = generatePlot();
    await fs.writeFile(
      path.join(dataDir, `wakapi-${name}-${interval}.svg`),
      svgString
    );
  }
}

async function run() {
  try {
    // Get inputs
    const apiKey = core.getInput('wakapi-token') || 'f02b0526-4c87-4fb5-8e2c-1a65283ac710';
    const base64ApiKey = Buffer.from(apiKey).toString('base64');

    const interval = core.getInput('interval', { required: false }) || '7_days';

    // Fetch Wakapi statistics
    const response = await fetch('https://wakapi.dev/api/summary?interval=' + interval, {
      headers: {
        'accept': 'application/json',
        'Authorization': 'Basic ' + base64ApiKey
      }
    });

    if (!response.ok) {
      console.error(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });

    // Save data to JSON file
    const fileName = `wakapi-stats-${interval}.json`;
    const filePath = path.join(dataDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Statistics saved to ${filePath}`);

    // Generate and save plots
    await generatePlots(data, dataDir, interval);
    console.log('Plots generated and saved');

    // Set the output
    core.setOutput("stats", JSON.stringify(data));
    console.log('Successfully fetched Wakapi statistics');

  } catch (error) {
    core.setFailed(error.message);
    console.error(error);
  }
}

run();
