import formatConfigUrl from '~/utils/formatConfigUrl'
import getConfig from '~/getters/getConfig'
export default function getCoreConfig() {
    const { core } = getConfig()
    return {
        ...core,
        landingPageUrl:
            formatConfigUrl(core?.landingPageUrl) || 'https://streamr.network',
        platformOriginUrl: formatConfigUrl(core?.platformOriginUrl),
        streamrUrl: formatConfigUrl(core?.streamrUrl),
        theGraphUrl: formatConfigUrl(core?.theGraphUrl),
        streamIndexerUrl: formatConfigUrl(core?.streamIndexerUrl),
    }
}
