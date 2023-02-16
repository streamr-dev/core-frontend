import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'
import validateWeb3 from '$utils/web3/validateWeb3'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,

    async connect(): Promise<string> {
        await validateWeb3({
            requireNetwork: false,
        })

        return await getDefaultWeb3Account()
    },
}
export default Metamask
