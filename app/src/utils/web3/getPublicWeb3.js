import Web3 from 'web3'
import getConfig, { getConfigForChain } from '$shared/web3/config'
import formatConfigUrl from '$utils/formatConfigUrl'

let instance

export default function getPublicWeb3(chainId?) {
    if (!instance) {
        const options = {
            timeout: 20000, // milliseconds
        }

        if (chainId) {
            const config = getConfigForChain(chainId)
            const httpEntry = config && config.rpcEndpoints.find((c) => c.url.toString().startsWith('http'))

            if (httpEntry && httpEntry.url) {
                let { url } = httpEntry

                // TODO: Config contains references to local docker environment (10.200.10.1).
                // Use formatConfigUrl to make sure we are compatible with other docker hosts as well.
                if (url.includes('10.200.10.1')) {
                    // Leave only port
                    url = url.replace('http://10.200.10.1', '')
                    url = formatConfigUrl(url)
                }

                return new Web3(new Web3.providers.HttpProvider(url, options))
            }
        }

        instance = new Web3(new Web3.providers.HttpProvider(getConfig().mainnet.rpcUrl, options))
    }

    return instance
}
