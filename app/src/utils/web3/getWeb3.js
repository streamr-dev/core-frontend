import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'
import getConfig from '$shared/web3/config'

let instance

export const defaultFallbackProvider = new FakeProvider()

export default function getWeb3() {
    if (!instance) {
        instance = new Web3(defaultFallbackProvider)

        instance.transactionConfirmationBlocks = getConfig().mainnet.transactionConfirmationBlocks
    }

    return instance
}
