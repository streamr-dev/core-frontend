import Web3 from 'web3'
import getConfig, { getConfigForChain } from '$shared/web3/config'

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

    return new Web3(new Web3.providers.HttpProvider(getConfig().mainnet.rpcUrl, options))
}
