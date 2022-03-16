import { useMemo, useCallback, useState, useEffect } from 'react'

import { getEthBalance } from '$mp/utils/web3'
import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'

const useRequireNativeTokenBalance = (minimumBalance = 0) => {
    const { isPending, wrap } = usePending('balance.CHECK')
    const isMounted = useIsMounted()
    const [hasBalance, setHasBalance] = useState(undefined)

    const checkBalance = useCallback((requiredBalance = minimumBalance) => (
        wrap(async () => {
            try {
                const balance = await getEthBalance()

                if (!isMounted()) {
                    return false
                }

                if (balance.isGreaterThan(requiredBalance)) {
                    setHasBalance(true)
                    return true
                }

                setHasBalance(false)
                return false
            } catch (e) {
                setHasBalance(false)
            }

            return false
        })
    ), [isMounted, wrap, minimumBalance])

    useEffect(() => {
        checkBalance()
    }, [minimumBalance, checkBalance])

    return useMemo(() => ({
        hasBalance,
        isPending,
        checkBalance,
    }), [
        hasBalance,
        isPending,
        checkBalance,
    ])
}

export default useRequireNativeTokenBalance
