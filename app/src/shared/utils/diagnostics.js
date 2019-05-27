/* Attach global diagnostic object */

import '../../analytics'

const navigator = global.navigator || {}

global.streamr = Object.assign(global.streamr || {}, {
    info() {
        return {
            userAgent: navigator.userAgent,
            environment: process.env.NODE_ENV,
            version: process.env.GIT_VERSION,
            branch: process.env.GIT_BRANCH,
        }
    },
})
