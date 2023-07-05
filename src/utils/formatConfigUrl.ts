import getConfig from '~/getters/getConfig'
export default function formatConfigUrl(url: string, { protocol = 'http' } = {}): string {
    const { docker } = getConfig()

    if (typeof url !== 'string' || (url && !/^[:/]/.test(url))) {
        return url
    }

    return `${protocol}://${process.env.STREAMR_DOCKER_DEV_HOST || docker?.host}${url}`
}
