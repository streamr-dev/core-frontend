import getConfig from '~/getters/getConfig'
export default function formatConfigUrl(url: string, { protocol = 'http' } = {}): string {
    const { docker } = getConfig()
    const dockerHost = process.env.STREAMR_DOCKER_DEV_HOST || docker?.host

    // Config contains references to local docker environment (10.200.10.1).
    // Make sure we are compatible with other docker hosts as well.
    if (typeof url === 'string' && url.includes('10.200.10.1') && dockerHost != null) {
        url = url.replace('10.200.10.1', dockerHost)
    }

    if (typeof url !== 'string' || (url && !/^[:/]/.test(url))) {
        return url
    }

    return `${protocol}://${dockerHost}${url}`
}
