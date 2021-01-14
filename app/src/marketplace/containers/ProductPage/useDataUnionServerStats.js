import { useState, useRef, useCallback, useMemo } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import { getDataUnionStats } from '$mp/modules/dataUnion/services'

const DATA_UNION_SERVER_POLL_INTERVAL_MS = 10000

function useDataUnionServerStats() {
    const [totalEarnings, setTotalEarnings] = useState(undefined)
    const [memberCount, setMemberCount] = useState(undefined)
    const isMounted = useIsMounted()

    const timeOutId = useRef(null)
    const resetTimeout = useCallback(() => {
        clearTimeout(timeOutId.current)
    }, [])

    const getStats = useCallback(async (dataUnionId) => {
        if (!dataUnionId) {
            throw new Error('Data union id not given')
        }

        try {
            const result = await getDataUnionStats(dataUnionId)
            if (!isMounted()) {
                return
            }
            setTotalEarnings(result.totalEarnings)
            setMemberCount(result.memberCount)
        } catch (e) {
            // Try again if status is 404, it means API might not be up yet
            if (e.statusCode && e.statusCode === 404) {
                console.warn(e)

                if (isMounted()) {
                    resetTimeout()
                    timeOutId.current = setTimeout(() => {
                        getStats(dataUnionId)
                    }, DATA_UNION_SERVER_POLL_INTERVAL_MS)
                }
            } else {
                // Otherwise pass the error on
                throw e
            }
        }
    }, [resetTimeout, isMounted])

    return useMemo(() => ({
        startPolling: getStats,
        stopPolling: resetTimeout,
        totalEarnings,
        memberCount,
    }), [
        getStats,
        resetTimeout,
        totalEarnings,
        memberCount,
    ])
}

export default useDataUnionServerStats
