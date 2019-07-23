import { useCallback } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'

export function useMountedCallback(fn, deps) {
    const isMountedRef = useIsMountedRef()
    return useCallback((...args) => {
        if (!isMountedRef.current) { return undefined }
        return fn(...args)
    }, [fn, isMountedRef, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useMountedCallback
