import { config as chainConfigs } from '@streamr/config'
import { produce } from 'immer'
import formatConfigUrl from '~/utils/formatConfigUrl'
import { Chain } from '~/types'
import { getChainConfigExtension } from '~/getters/getChainConfigExtension'

export function getRawChainConfig(chainId: number): Chain {
    const chain = Object.entries(chainConfigs).find(
        (c) => c[1].id.toString() === chainId.toString(),
    )?.[1]

    if (!chain) {
        throw new Error(`Could not find config for chainId ${chainId}`)
    }

    return chain
}

export const getConfigForChain = (chainId: number): Chain => {
    const chain = getRawChainConfig(chainId)

    const { dockerHost } = getChainConfigExtension(chainId)

    // Fix local rpc urls
    const config: Chain = produce(chain, (draft) => {
        draft.rpcEndpoints = draft.rpcEndpoints.map((rpc) => {
            let { url } = rpc

            // Config contains references to local docker environment (10.200.10.1).
            // Use formatConfigUrl to make sure we are compatible with other docker hosts as well.
            if (url.includes('10.200.10.1')) {
                // Leave only port
                url = url.replace('http://10.200.10.1', '')
                url = formatConfigUrl(url, {
                    dockerHost,
                })
            }

            return {
                url,
            }
        })
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
