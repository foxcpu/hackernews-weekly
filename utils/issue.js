const { Octokit } = require("@octokit/core");
const { createAppAuth } = require("@octokit/auth-app");

let secrets = {};

try {
  secrets = require('../secret.js');
} catch (error) {
  console.log('no secret json, on github action')
}

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    id: 886189,
    installationId: 50103616,
    clientId: "Iv1.4d10faba6f274948",
    privateKey: process.env.privateKey  ? process.env.privateKey  : secrets.privateKey,
  },
});

// console.log(process.env.privateKey)

const open = async ({owner, repo, title, body}) => {
  try {    
    console.log('opening issue');
    const res = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title,
      body,
    });
    console.log('opened');
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const lock = async ({owner, repo, issueNumber}) => {
  console.log('locking issue');
  console.log('PUT /repos/'+owner+'/'+repo+'/issues/'+issueNumber+'/lock');
  await octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/lock', {
    owner: owner,
    repo: repo,
    issue_number: issueNumber,
    lock_reason: 'resolved'
  });
  console.log('locked');
}

module.exports = {
  open,
  lock,
}

// lock({
//   owner: 'headllines',
//   repo: 'hackernews-daily',
//   issueNumber: 39,
// });
