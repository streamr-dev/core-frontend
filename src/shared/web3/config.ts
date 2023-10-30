import { config as chainConfigs } from '@streamr/config'
import formatConfigUrl from '~/utils/formatConfigUrl'
import { Chain } from '~/types'

export const getConfigForChain = (chainId: number): Chain => {
    const configEntry = Object.entries(chainConfigs).find(
        (c) => c[1].id.toString() === chainId.toString(),
    )

    if (!configEntry) {
        throw new Error(`Could not find config for chainId ${chainId}`)
    }

    const config: Chain = configEntry[1]
    // Fix local rpc urls
    config.rpcEndpoints = config.rpcEndpoints.map((rpc) => {
        let { url } = rpc

        // Config contains references to local docker environment (10.200.10.1).
        // Use formatConfigUrl to make sure we are compatible with other docker hosts as well.
        if (url.includes('10.200.10.1')) {
            // Leave only port
            url = url.replace('http://10.200.10.1', '')
            url = formatConfigUrl(url)
        }

        return {
            url,
        }
    })
    return config
}
export const getConfigForChainByName = (chainName: string): Chain => {
    const configEntry = Object.entries(chainConfigs).find((c) => c[0] === chainName)

    if (configEntry == null) {
        throw new Error(`Could not find config for chain with name ${chainName}`)
    }

    const config: Chain = configEntry[1]
    return getConfigForChain(config.id)
}
