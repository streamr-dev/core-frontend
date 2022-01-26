import getDockerUrl from './getDockerUrl'

export default function getStreamrUrl() {
    return process.env.STREAMR_URL || getDockerUrl()
}
