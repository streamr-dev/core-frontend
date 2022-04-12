import { useState, useMemo, useCallback } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import { switchNetwork, addNetwork } from '$shared/utils/network'
import MissingNetworkError from '$shared/errors/MissingNetworkError'

export default function useSwitchChain() {
    const [switchPending, setSwitchPending] = useState(false)
    const isMounted = useIsMounted()

    const switchChain = useCallback(async (nextChainId) => {
        setSwitchPending(true)

        let success = false

        try {
            await switchNetwork(nextChainId)
            success = true
        } catch (e) {
            if (e instanceof MissingNetworkError) {
                // Let's add the missing network.
                await addNetwork(nextChainId)

                // And switch to it immediately after.
                return await switchChain(nextChainId)
            }

            throw e
        } finally {
            if (isMounted()) {
                setSwitchPending(false)
            }
        }

        return success
    }, [isMounted])

    return useMemo(() => ({
        switchChain,
        switchPending,
    }), [
        switchChain,
        switchPending,
    ])
}
