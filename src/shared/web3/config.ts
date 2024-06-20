import { produce } from 'immer'
import formatConfigUrl from '~/utils/formatConfigUrl'
import { Chain } from '~/types'
import { getChainConfigExtension } from '~/getters/getChainConfigExtension'
import { getChainConfig } from '~/utils/chains'

export const getConfigForChain = (chainId: number): Chain => {
    const chain = getChainConfig(chainId)

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
