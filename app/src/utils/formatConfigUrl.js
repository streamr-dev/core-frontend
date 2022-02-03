import getConfig from '$app/src/getters/getConfig'

export default function formatConfigUrl(url, { protocol = 'http' } = {}) {
    const { docker } = getConfig()

    if (typeof url !== 'string' || (url && !/^[:/]/.test(url))) {
        return url
    }

    return `${protocol}://${process.env.STREAMR_DOCKER_DEV_HOST || docker?.host}${url}`
}
