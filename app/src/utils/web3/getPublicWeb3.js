import Web3 from 'web3'
import { getConfigForChain } from '$shared/web3/config'
import getCoreConfig from '$app/src/getters/getCoreConfig'

export default function getPublicWeb3(chainId?) {
    const options = {
        timeout: 20000, // milliseconds
    }

    if (chainId) {
        const config = getConfigForChain(chainId)
        const httpEntry = config.rpcEndpoints.find((rpc) => rpc.url.startsWith('http'))

        if (httpEntry) {
            const { url } = httpEntry
            return new Web3(new Web3.providers.HttpProvider(url, options))
        }
    }

    // Fall back to Ethereum Mainnet if chain specific provider was not available
    return new Web3(new Web3.providers.HttpProvider(getCoreConfig().mainnetInfuraUrl, options))
}
