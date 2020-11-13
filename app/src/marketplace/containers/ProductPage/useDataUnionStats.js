import { useEffect, useRef, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import useProduct from '$mp/containers/ProductController/useProduct'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getDataUnionStats } from '$mp/modules/dataUnion/actions'
import { selectDataUnionStats } from '$mp/modules/dataUnion/selectors'

import usePreviewStats from './usePreviewStats'

const DATA_UNION_SERVER_POLL_INTERVAL_MS = 10000

function useDataUnionStats() {
    const { created, beneficiaryAddress } = useProduct() || {}
    const { subscriberCount } = useContractProduct() || {
        subscriberCount: 0,
    }
    const { adminFee } = useDataUnion() || {}
    const { memberCount, totalEarnings } = useSelector(selectDataUnionStats) || {}
    const isMounted = useIsMounted()
    const dispatch = useDispatch()

    const { stats } = usePreviewStats({
        created,
        subscriberCount,
        adminFee,
        memberCount,
        totalEarnings,
    })

    const timeOutId = useRef(null)
    const resetTimeout = useCallback(() => {
        clearTimeout(timeOutId.current)
    }, [])

    const getStats = useCallback(async () => {
        if (!beneficiaryAddress) { return }
        try {
            await dispatch(getDataUnionStats(beneficiaryAddress))
            if (!isMounted()) {
                return
            }
        } catch (e) {
            // Try again if status is 404, it means API might not be up yet
            if (e.statusCode && e.statusCode === 503) {
                console.warn(e)

                if (isMounted()) {
                    resetTimeout()
                    timeOutId.current = setTimeout(getStats, DATA_UNION_SERVER_POLL_INTERVAL_MS)
                }
            } else {
                // Otherwise pass the error on
                throw e
            }
        }
    }, [beneficiaryAddress, dispatch, timeOutId, resetTimeout, isMounted])

    useEffect(() => {
        getStats()

        return () => {
            resetTimeout()
        }
    }, [getStats, resetTimeout])

    return useMemo(() => ({
        totalEarnings,
        memberCount,
        stats,
    }), [
        totalEarnings,
        memberCount,
        stats,
    ])
}

export default useDataUnionStats
