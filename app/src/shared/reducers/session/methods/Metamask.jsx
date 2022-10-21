import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'
import validateWeb3 from '$utils/web3/validateWeb3'
import getSessionToken from '$auth/utils/getSessionToken'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,
    async connect() {
        await validateWeb3({
            requireNetwork: false,
        })

        const address = await getDefaultWeb3Account()
        const token = await getSessionToken(address)
        return token
    },
}

export default Metamask
