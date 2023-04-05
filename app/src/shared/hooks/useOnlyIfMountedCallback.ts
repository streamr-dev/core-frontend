import { useCallback, useRef } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
export function useOnlyIfMountedCallback(fn, deps) {
    const isMountedRef = useIsMountedRef()
    const fnRef = useRef(fn)
    fnRef.current = fn
    return useCallback(
        (...args) => {
            if (!isMountedRef.current) {
                return undefined
            }

            return fnRef.current(...args)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fnRef, isMountedRef, ...deps],
    )
}
export default useOnlyIfMountedCallback
