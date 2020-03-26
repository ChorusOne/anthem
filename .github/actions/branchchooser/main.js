const core = require('@actions/core');
const fs = require('fs');
async function run() {
    try {
        var event = null;
        var branch = null;

        if(fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
          var event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
        

          switch(process.env.GITHUB_EVENT_NAME) {
            case "push": {
              var branch = event.ref.replace('refs/heads/', '');
              break;
            }

            case "pull_request": {
              var branch = event.pull_request.base.ref;
              break;
            }
          }
        }

        console.log('Event: ' + process.env.GITHUB_EVENT_NAME)
        console.log('Using branch: ' + branch)

        switch (branch) {
            case "master": {
                core.setOutput('environment', "prod");
                core.setOutput('tag', "latest");
                core.setOutput('namespace', "default");
                break;
            }
            case "staging": {
                core.setOutput('environment', "staging");
                core.setOutput('tag', "test");
                core.setOutput('namespace', "default");
                break;
            }
            default: {
                core.setOutput('environment', "test");
                core.setOutput('tag', "dev-" + process.env.GITHUB_SHA);
                core.setOutput('namespace', "test");
                break;
            }
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
