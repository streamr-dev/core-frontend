import config from '$config'

export default function formatConfigUrl(url, { protocol = 'http' } = {}) {
    const { docker } = config

    if (typeof url !== 'string' || (url && !/^[:/]/.test(url))) {
        return url
    }

    return `${protocol}://${process.env.STREAMR_DOCKER_DEV_HOST || docker?.host}${url}`
}
