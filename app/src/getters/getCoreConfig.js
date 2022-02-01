import formatConfigUrl from '$utils/formatConfigUrl'
import config from '$config'

export default function getCoreConfig() {
    const { core } = config

    return {
        landingPageUrl: formatConfigUrl(core?.landingPageUrl) || 'https://streamr.network',
        platformOriginUrl: formatConfigUrl(core?.platformOriginUrl),
        streamrUrl: formatConfigUrl(core?.streamrUrl),
    }
}
