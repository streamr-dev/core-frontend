import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'

/**
 * @deprecated Use `getWalletWeb3Provider` instead.
 */
export default function getWeb3(): Web3 {
    const ethereumProvider = window.ethereum || (window.web3 || {}).currentProvider || new FakeProvider()
    // Disable automatic reload when network is changed in Metamask,
    // reload is handled in GlobalInfoWatcher component.
    ethereumProvider.autoRefreshOnNetworkChange = false

    return new Web3(ethereumProvider)
}
