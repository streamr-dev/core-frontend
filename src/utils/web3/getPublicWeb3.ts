import { providers } from 'ethers'
import { getConfigForChain } from '~/shared/web3/config'
import getCoreConfig from '~/getters/getCoreConfig'

/**
 * @deprecated Use `getPublicWeb3Provider` instead.
 */
export default function getPublicWeb3(chainId?: number) {
    let url: string = getCoreConfig().mainnetInfuraUrl

    if (chainId) {
        const config = getConfigForChain(chainId)

        const httpEntry = config.rpcEndpoints.find((rpc) => rpc.url.startsWith('http'))

        if (httpEntry) {
            url = httpEntry.url
        }
    }

    const provider = new providers.JsonRpcProvider(url)

    return provider
}
