/* Print diagnostic info to console */

const navigator = global.navigator || {}
// eslint-disable-next-line no-console
console.info('Streamr Platform', {
    userAgent: navigator.userAgent,
    environment: process.env.NODE_ENV,
    version: process.env.GIT_VERSION,
    branch: process.env.GIT_BRANCH,
})
