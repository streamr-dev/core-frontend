import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'
import getConfig from '$shared/web3/config'
import { getRecentMethod } from '$shared/reducers/session/methods'

let instance

export const defaultFallbackProvider = new FakeProvider()

export default function getWeb3() {
    if (!instance) {
        let provider

        try {
            provider = getRecentMethod().getEthereumProvider()
        } catch (e) {
            // No-op.
        }

        instance = new Web3(provider || defaultFallbackProvider)

        instance.transactionConfirmationBlocks = getConfig().mainnet.transactionConfirmationBlocks
    }

    return instance
}
