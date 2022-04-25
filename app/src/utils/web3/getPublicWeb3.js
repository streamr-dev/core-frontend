import Web3 from 'web3'
import getConfig, { getConfigForChain } from '$shared/web3/config'

let instance

export default function getPublicWeb3(chainId?) {
    if (!instance) {
        const options = {
            timeout: 20000, // milliseconds
        }

        if (chainId) {
            const config = getConfigForChain(chainId)
            const http = config && config.rpcEndpoints.find((c) => c.url.toString().startsWith('http'))
            if (http) {
                return new Web3(new Web3.providers.HttpProvider(http.url, options))
            }
        }

        instance = new Web3(new Web3.providers.HttpProvider(getConfig().mainnet.rpcUrl, options))
    }

    return instance
}
