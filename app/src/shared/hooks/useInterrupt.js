import { useRef, useCallback, useEffect } from 'react'
import InterruptionError from '$shared/errors/InterruptionError'

function bump(collection, key) {
    Object.assign(collection, {
        [key]: (collection[key] || 0) + 1,
    })
}

function bumpAllMatching(collection, regExp) {
    Object.keys(collection).forEach((key) => {
        if (regExp.test(key)) {
            bump(collection, key)
        }
    })
}

export default function useInterrupt() {
    const countRef = useRef({})

    useEffect(() => () => {
        // Interrupt all on unmount.
        bumpAllMatching(countRef.current, /.*/)
    }, [])

    return useCallback((cacheKey = '') => {
        bump(countRef.current, cacheKey)

        const count = countRef.current[cacheKey]

        function interrupted() {
            return count !== countRef.current[cacheKey]
        }

        return {
            interrupt() {
                bump(countRef.current, cacheKey)
            },
            interruptAll(regExp = /.*/) {
                bumpAllMatching(countRef.current, regExp)
            },
            requireUninterrupted() {
                if (interrupted()) {
                    throw new InterruptionError()
                }
            },
            interrupted,
        }
    }, [])
}
