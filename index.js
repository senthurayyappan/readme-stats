const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get inputs
    const apiKey = core.getInput('wakapi-token');
    const interval = core.getInput('interval', { required: false }) || '7_days';

    // Fetch Wakapi statistics
    const response = await fetch('https://wakapi.dev/api/summary?interval=' + interval, {
      headers: {
        'accept': 'application/json',
        'Authorization': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Set the output
    core.setOutput("stats", JSON.stringify(data));
    console.log('Successfully fetched Wakapi statistics');

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
