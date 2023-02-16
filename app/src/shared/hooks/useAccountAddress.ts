import { useState, useEffect } from 'react'
import Web3Poller, { events } from '$shared/web3/Web3Poller'
import useIsMounted from '$shared/hooks/useIsMounted'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
const useAccountAddress = (): string | null | undefined => {
    const [address, setAddress] = useState<string>()
    const isMounted = useIsMounted()
    useEffect(() => {
        (async () => {
            try {
                return await getDefaultWeb3Account()
            } catch (e) {
                return undefined
            }
        })().then((addr) => {
            if (isMounted()) {
                setAddress(addr)
            }
        })

        const setLocked = () => {
            if (isMounted()) {
                setAddress(undefined)
            }
        }

        Web3Poller.subscribe(events.ACCOUNT, setAddress)
        Web3Poller.subscribe(events.ACCOUNT_ERROR, setLocked)
        return () => {
            Web3Poller.unsubscribe(events.ACCOUNT, setAddress)
            Web3Poller.unsubscribe(events.ACCOUNT_ERROR, setLocked)
        }
    }, [isMounted])
    return address
}

export default useAccountAddress
