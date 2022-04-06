// @flow

import { useMemo, useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import useModal from '$shared/hooks/useModal'
import validateWeb3 from '$utils/web3/validateWeb3'
import WrongNetworkSelectedError from '$shared/errors/WrongNetworkSelectedError'
import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'

const useRequireNetwork = (requiredNetwork: number, check: boolean = true, monitorNetworkChange: boolean = true) => {
    const { api: switchNetworkDialog } = useModal('switchNetwork')
    const { isPending, wrap } = usePending('network.CHECK')
    const [isCorrect, setIsCorrect] = useState(undefined)
    const isMounted = useIsMounted()
    const currentNetworkId = useSelector(selectEthereumNetworkId)

    const validateNetwork = useCallback((rethrow: boolean = false) => (
        wrap(async () => {
            try {
                await validateWeb3({
                    requireNetwork: requiredNetwork,
                })

                if (!isMounted()) {
                    return
                }
                setIsCorrect(true)
            } catch (e) {
                let propagateError = true

                if (e instanceof WrongNetworkSelectedError) {
                    setIsCorrect(false)

                    const { proceed } = await switchNetworkDialog.open({
                        requiredNetwork: e.requiredNetwork,
                        initialNetwork: e.currentNetwork,
                    })

                    if (!isMounted()) {
                        return
                    }

                    propagateError = !proceed
                }

                if (rethrow && propagateError) {
                    console.error('Rethrowing', e)
                    throw e
                }
            }
        })
    ), [switchNetworkDialog, requiredNetwork, isMounted, wrap])

    useEffect(() => {
        if (check && isCorrect === undefined && !isPending) {
            validateNetwork()
        }
    }, [validateNetwork, isCorrect, isPending, check])

    useEffect(() => {
        if (check && monitorNetworkChange) {
            validateNetwork()
        }
        // Somehow usePending goes totally crazy if we include validateNetwork as a dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monitorNetworkChange, currentNetworkId])

    return useMemo(() => ({
        isCorrect,
        isPending,
        validateNetwork,
    }), [
        isCorrect,
        isPending,
        validateNetwork,
    ])
}

export default useRequireNetwork
