import getDockerUrl from './getDockerUrl'

export default function getRestUrl() {
    return process.env.REST_URL || `${getDockerUrl()}/api/v1`
}
