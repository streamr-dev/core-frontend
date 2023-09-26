import getMainChainId from '~/getters/getMainChainId'
import getCoreConfig from './getCoreConfig'

export function getBlockExplorerUrl(chainId?: number): string {
    const actualChainId = chainId ?? getMainChainId()
    const map: { chainId: unknown; url: unknown }[] = getCoreConfig().blockExplorerUrls
    const item = map.find((i) => i.chainId === actualChainId)

    if (typeof item?.url !== 'string') {
        throw new Error(
            `No blockExplorerUrl defined in config for chain ${actualChainId}!`,
        )
    }

    return item.url
}
