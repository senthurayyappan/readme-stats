const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get inputs
    const token = core.getInput('github-token');
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');

    // Create Octokit client
    const octokit = github.getOctokit(token);

    // Fetch repository statistics
    const response = await octokit.request('GET /repos/{owner}/{repo}/stats/code_frequency', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    // Set the output
    core.setOutput("stats", JSON.stringify(response.data));
    console.log('Successfully fetched repository statistics');

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
