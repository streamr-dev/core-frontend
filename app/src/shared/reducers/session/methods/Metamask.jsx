import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'
import validateWeb3 from '$utils/web3/validateWeb3'
import getWeb3 from '$utils/web3/getWeb3'
import getSessionToken from '$auth/utils/getSessionToken'

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,
    async connect() {
        const web3 = getWeb3()

        await validateWeb3({
            web3,
            requireNetwork: false,
        })

        const token = await getSessionToken({
            ethereum: web3.currentProvider,
        })

        return token
    },
}

export default Metamask
