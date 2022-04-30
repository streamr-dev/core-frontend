import Web3 from 'web3'
import FakeProvider from 'web3-fake-provider'

// Disable automatic reload when network is changed in Metamask,
// reload is handled in GlobalInfoWatcher component
if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

export default function getWeb3() {
    const { ethereum, web3 } = window
    return new Web3(ethereum || (web3 || {}).currentProvider || new FakeProvider())
}
