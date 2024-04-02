const isGithubActions = process.env.GITHUB_ACTIONS || false;
let prefix = ''

if (isGithubActions) {
    prefix = '/pomodoro-timer/';
}

export { prefix };