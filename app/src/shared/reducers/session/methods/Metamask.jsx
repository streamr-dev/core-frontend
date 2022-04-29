import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'
import { defaultFallbackProvider } from '$utils/web3/getWeb3'

let provider

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,
    getEthereumProvider() {
        if (!provider) {
            provider = window.ethereum || (window.web3 || {}).currentProvider || defaultFallbackProvider

            // Disable automatic reload when network is changed in MetaMask. Reload is handled
            // in `GlobalInfoWatcher` component.
            provider.autoRefreshOnNetworkChange = false
        }

        return provider
    },
}

export default Metamask
