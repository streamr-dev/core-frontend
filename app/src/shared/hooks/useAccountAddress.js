// @flow

import { useState, useEffect } from 'react'
import { getWeb3 } from '$shared/web3/web3Provider'
import Web3Poller from '$shared/web3/web3Poller'
import useIsMounted from '$shared/hooks/useIsMounted'

export default (): ?string => {
    const [address, setAddress] = useState()

    const isMounted = useIsMounted()

    useEffect(() => {
        (async () => {
            try {
                return await getWeb3().getDefaultAccount()
            } catch (e) {
                return undefined
            }
        })().then((addr) => {
            if (isMounted()) {
                setAddress(addr)
            }
        })

        Web3Poller.subscribe(Web3Poller.events.ACCOUNT, setAddress)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, setAddress)
        }
    }, [])

    return address
}
