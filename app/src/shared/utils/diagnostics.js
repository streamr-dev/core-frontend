// You should init the Sentry browser SDK as soon as possible during your application load up, before initializing React
// https://docs.sentry.io/platforms/javascript/react/
import '../../analytics'

/* Attach global diagnostic object */
const navigator = global.navigator || {}

global.streamr = Object.assign(global.streamr || {}, {
    info() {
        return {
            userAgent: navigator.userAgent,
            environment: process.env.NODE_ENV,
            version: process.env.GIT_VERSION || process.env.TRAVIS_TAG,
            branch: process.env.GIT_BRANCH || process.env.TRAVIS_BRANCH,
        }
    },
})
