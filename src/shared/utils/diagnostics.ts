// You should init the Sentry browser SDK as soon as possible during your application load up, before initializing React
// https://docs.sentry.io/platforms/javascript/react/
import '~/analytics'
import packageLock from '../../../package-lock.json'
const navigator = global.navigator || {}
const streamrClientVersion = (packageLock as any).packages['node_modules/@streamr/sdk']
    .version
global.streamr = Object.assign(global.streamr || {}, {
    info() {
        const info = {
            userAgent: navigator.userAgent,
            environment: process.env.NODE_ENV,
            streamrClientVersion,
        }

        const version = process.env.GIT_VERSION || ''
        const branch = process.env.GIT_BRANCH || ''
        const isMaster = branch === 'master'
        // version e.g. v2.0.5-926-g7e20dd2eb
        const [versionNumber, , hash] = version.split('-')
        // hash minus leading 'g', not shown on master
        const displayHash = isMaster ? '' : hash && hash.slice(1)
        // don't show branch if master
        let displayBranch = branch === 'master' ? '' : branch
        // replace hyphen in branch name with non-breaking hyphen
        displayBranch = branch.replace(/-/g, '‑')
        return {
            ...info,
            version: versionNumber,
            branch: displayBranch,
            hash: displayHash,
        }
    },
})
