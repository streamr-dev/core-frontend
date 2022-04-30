import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'

const web3 = new Web3()

const defaultFallbackProvider = new FakeProvider()

export default function getWeb3() {
    const ethereumProvider = window.ethereum || (window.web3 || {}).currentProvider || defaultFallbackProvider

    // Disable automatic reload when network is changed in Metamask,
    // reload is handled in GlobalInfoWatcher component.
    ethereumProvider.autoRefreshOnNetworkChange = false

    if (ethereumProvider !== web3.currentProvider) {
        web3.setProvider(ethereumProvider)
    }

    return web3
}
