import { useRef, useCallback, useEffect } from 'react'
import InterruptionError from '$shared/errors/InterruptionError'

export default function useInterrupt() {
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

        let interrupted = false

        return {
            interrupt() {
                interrupted = true
            },
            requireUninterrupted() {
                if (interrupted || countRef.current == null || count !== countRef.current[cacheKey]) {
                    throw new InterruptionError()
                }
            },
        }
    }, [])
}
