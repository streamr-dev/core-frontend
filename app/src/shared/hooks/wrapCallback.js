import { useLayoutEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

export default function wrapCallback(wrapperFn) {
    return (fn, ...args) => {
        const wrappedFn = useMemo(() => (
            wrapperFn(fn, ...args)
        ), [fn, ...args]) // eslint-disable-line react-hooks/exhaustive-deps

        // cancel existing on unmount/change
        useLayoutEffect(() => () => {
            // useLayoutEffect to ensure cancel asap
            if (wrappedFn && wrappedFn.cancel) {
                wrappedFn.cancel()
            }
        }, [wrappedFn])

        return wrappedFn
    }
}

/**
 * Usage:
 * import { useDebounced } from '$shared/hooks/wrapCallback'
 * ...
 * const myCallback = useCallback(…)
 * const myDebouncedCallback = useDebounced(myCallback, 500)
 */

export const useDebounced = wrapCallback(debounce)
export const useThrottled = wrapCallback(throttle)
