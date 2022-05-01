import Web3 from 'web3'
import getClientConfig from '$app/src/getters/getClientConfig'

let instance

export default function getDataUnionChainWeb3() {
    if (!instance) {
        const { url } = getClientConfig().dataUnionChainRPC
        instance = new Web3(new Web3.providers.HttpProvider(url))
    }

    return instance
}
