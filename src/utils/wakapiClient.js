const core = require('@actions/core');

exports.fetchWakapiStats = async function(apiKey, interval) {
  const base64ApiKey = Buffer.from(apiKey).toString('base64');
  
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

  return await response.json();
}; 