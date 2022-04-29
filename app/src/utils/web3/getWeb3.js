import FakeProvider from 'web3-fake-provider'
import { StreamrWeb3 } from '$shared/web3/web3Provider'

// Disable automatic reload when network is changed in Metamask,
// reload is handled in GlobalInfoWatcher component
if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

export default function getWeb3() {
    const { ethereum, web3 } = window

    if (typeof ethereum !== 'undefined') {
        return new StreamrWeb3(ethereum)
    } else if (typeof web3 !== 'undefined') {
        return new StreamrWeb3(web3.currentProvider, {
            isLegacy: true,
        })
    }
    return new StreamrWeb3(new FakeProvider(), {
        isLegacy: true,
    })
}
