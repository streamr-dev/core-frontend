import formatConfigUrl from '~/utils/formatConfigUrl'
import getConfig from '~/getters/getConfig'

/**
 * @todo Make sure we get reasonable types out of this config. Atm it's all chaos and anyness.
 */
export default function getCoreConfig() {
    const { core } = getConfig()
    return {
        ...core,
        theGraphUrl: formatConfigUrl(core?.theGraphUrl),
        streamIndexerUrl: formatConfigUrl(core?.streamIndexerUrl),
    }
}
