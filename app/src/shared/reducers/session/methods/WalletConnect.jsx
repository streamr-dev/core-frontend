import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'

const WalletConnect = {
    id: 'walletConnect',
    label: 'WalletConnect',
    icon: <SignInMethod.Icon.WalletConnect />,
    async connect() {
        throw new Error('Not implemented')
    },
}

export default WalletConnect
