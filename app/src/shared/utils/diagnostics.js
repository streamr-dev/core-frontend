// You should init the Sentry browser SDK as soon as possible during your application load up, before initializing React
// https://docs.sentry.io/platforms/javascript/react/
import '../../analytics'
import { dependencies } from '$app/package-lock'

const navigator = global.navigator || {}
const streamrClientVersion = dependencies['streamr-client'].version

global.streamr = Object.assign(global.streamr || {}, {
    info() {
        const info = {
            userAgent: navigator.userAgent,
            environment: process.env.NODE_ENV,
            streamrClientVersion,
        }

        if (process.env.TRAVIS_TAG) {
            // If the current build is for a git tag
            // - TRAVIS_TAG is set to the tag’s name
            // - TRAVIS_COMMIT is the commit that the current build is testing
            return {
                ...info,
                branch: '',
                version: process.env.TRAVIS_TAG,
                hash: String(process.env.TRAVIS_COMMIT).substr(0, 8),
            }
        } else if (process.env.TRAVIS_PULL_REQUEST_BRANCH) {
            // if the current job is a pull request:
            // - TRAVIS_PULL_REQUEST_BRANCH is the name of the branch from which the PR originated
            // - TRAVIS_PULL_REQUEST_SHA is the commit SHA of the HEAD commit of the PR.
            return {
                ...info,
                branch: process.env.TRAVIS_PULL_REQUEST_BRANCH,
                version: '',
                hash: String(process.env.TRAVIS_PULL_REQUEST_SHA).substr(0, 8),
            }
        } else if (process.env.TRAVIS_BRANCH) {
            // for push builds, or builds not triggered by a pull request
            // - TRAVIS_BRANCH is the name of the branch.
            // - TRAVIS_COMMIT is the commit that the current build is testing
            return {
                ...info,
                branch: process.env.TRAVIS_BRANCH,
                version: '',
                hash: String(process.env.TRAVIS_COMMIT).substr(0, 8),
            }
        }

        const version = process.env.GIT_VERSION
        const branch = process.env.GIT_BRANCH

        const isMaster = branch === 'master'
        // version e.g. v2.0.5-926-g7e20dd2eb
        const [versionNumber, , hash] = version.split('-')

        // hash minus leading 'g', not shown on master
        const displayHash = isMaster ? '' : hash.slice(1)

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
