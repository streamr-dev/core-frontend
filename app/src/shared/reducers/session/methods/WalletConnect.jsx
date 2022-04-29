import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'

const WalletConnect = {
    id: 'walletConnect',
    label: 'WalletConnect',
    icon: <SignInMethod.Icon.WalletConnect />,
    getEthereumProvider() {
        throw new Error('Not implemented')
    },
}

export default WalletConnect
