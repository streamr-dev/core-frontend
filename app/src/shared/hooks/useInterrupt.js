import { useRef, useCallback, useEffect } from 'react'
import InterruptionError from '$shared/errors/InterruptionError'

function bump(collection, key) {
    Object.assign(collection, {
        [key]: collection[key] + 1,
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
        function interrupt(key) {
            countRef.current[key] += 1
        }

        if (countRef.current[cacheKey] == null) {
            countRef.current[cacheKey] = 0
        }

        interrupt(cacheKey)

        const count = countRef.current[cacheKey]

        return {
            interrupt() {
                bump(countRef.current, cacheKey)
            },
            interruptAll(regExp = /.*/) {
                bumpAllMatching(countRef.current, regExp)
            },
            requireUninterrupted() {
                if (count !== countRef.current[cacheKey]) {
                    throw new InterruptionError()
                }
            },
        }
    }, [])
}
