import Web3 from 'web3'
import getConfig from '$shared/web3/config'

export default function getPublicWeb3() {
    return new Web3(new Web3.providers.HttpProvider(getConfig().mainnet.rpcUrl, {
        timeout: 20000, // milliseconds
    }))
}
