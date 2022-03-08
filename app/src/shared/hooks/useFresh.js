import { useRef, useCallback, useEffect } from 'react'
import StaleError from '$shared/errors/StaleError'

export default function useFresh() {
    const countRef = useRef({})

    useEffect(() => () => {
        // Invalidate all on unmount.
        countRef.current = undefined
    }, [])

    return useCallback((cacheKey = '') => {
        if (countRef.current[cacheKey] == null) {
            countRef.current[cacheKey] = 0
        }
        countRef.current[cacheKey] += 1

        const count = countRef.current[cacheKey]

        let isStale = false

        return {
            requireFresh() {
                if (isStale || countRef.current == null || count !== countRef.current[cacheKey]) {
                    throw new StaleError()
                }
            },
            stale() {
                isStale = true
            },
        }
    }, [])
}
