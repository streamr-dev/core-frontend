import getCoreConfig from './getCoreConfig'
import { defaultChainConfig } from './getChainConfig'

export function getBlockExplorerUrl(chainId?: number): string {
    const actualChainId = chainId ?? defaultChainConfig.id
    const map: { chainId: unknown; url: unknown }[] = getCoreConfig().blockExplorerUrls
    const item = map.find((i) => i.chainId === actualChainId)

    if (typeof item?.url !== 'string') {
        throw new Error(
            `No blockExplorerUrl defined in config for chain ${actualChainId}!`,
        )
    }

    return item.url
}
