import Web3 from 'web3'
import getConfig from '$shared/web3/config'

let instance

export default function getPublicWeb3() {
    if (!instance) {
        instance = new Web3(new Web3.providers.HttpProvider(getConfig().mainnet.rpcUrl, {
            timeout: 20000, // milliseconds
        }))
    }

    return instance
}
