import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'
import validateWeb3 from '$utils/web3/validateWeb3'
import getSessionToken from '$auth/utils/getSessionToken'
import getWeb3 from '$utils/web3/getWeb3'

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,
    async connect() {
        await validateWeb3({
            requireNetwork: false,
        })

        const token = await getSessionToken({
            ethereum: getWeb3().currentProvider,
        })

        return token
    },
}

export default Metamask
