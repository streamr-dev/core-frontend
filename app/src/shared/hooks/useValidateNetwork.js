import { useCallback, useEffect, useRef } from 'react'
import useModal from '$shared/hooks/useModal'
import { WrongNetworkSelectedError } from '$shared/errors/Web3'
import { getWeb3, validateWeb3 } from '$shared/web3/web3Provider'
import useInterrupt from '$shared/hooks/useInterrupt'

export default function useValidateNetwork() {
    const { api: switchNetworkDialog } = useModal('switchNetwork')

    const switchNetworkDialogRef = useRef(switchNetworkDialog)

    useEffect(() => {
        switchNetworkDialogRef.current = switchNetworkDialog
    }, [switchNetworkDialog])

    const itp = useInterrupt()

    useEffect(() => () => {
        itp().interruptAll()
    }, [itp])

    return useCallback(async (nextChainId) => {
        const { requireUninterrupted } = itp()

        try {
            await validateWeb3({
                web3: getWeb3(),
                requireNetwork: nextChainId,
            })

            requireUninterrupted()
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
