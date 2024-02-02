import getCoreConfig from './getCoreConfig'

export function getBlockExplorerUrl(chainId: number): string {
    const map: { chainId: unknown; url: unknown }[] = getCoreConfig().blockExplorerUrls

    const item = map.find((i) => i.chainId === chainId)

    if (typeof item?.url !== 'string') {
        throw new Error(`No blockExplorerUrl defined in config for chain ${chainId}!`)
    }

    return item.url
}
