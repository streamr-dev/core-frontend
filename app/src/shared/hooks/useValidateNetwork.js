import { useCallback, useEffect, useRef } from 'react'
import useModal from '$shared/hooks/useModal'
import WrongNetworkSelectedError from '$shared/errors/WrongNetworkSelectedError'
import validateWeb3 from '$utils/web3/validateWeb3'
import useInterrupt from '$shared/hooks/useInterrupt'

export default function useValidateNetwork() {
    const { api: switchNetworkDialog } = useModal('switchNetwork')

    const switchNetworkDialogRef = useRef(switchNetworkDialog)

    useEffect(() => {
        switchNetworkDialogRef.current = switchNetworkDialog
    }, [switchNetworkDialog])

    const itp = useInterrupt()

    return useCallback(async (nextChainId) => {
        const { requireUninterrupted } = itp()

        try {
            try {
                await validateWeb3({
                    requireNetwork: nextChainId,
                })
            } finally {
                requireUninterrupted()
            }
        } catch (e) {
            if (e instanceof WrongNetworkSelectedError) {
                const { proceed } = await switchNetworkDialogRef.current.open({
                    requiredNetwork: e.requiredNetwork,
                    initialNetwork: e.currentNetwork,
                })

                requireUninterrupted()

                if (proceed) {
                    return
                }
            }

            throw e
        }
    }, [itp])
}
