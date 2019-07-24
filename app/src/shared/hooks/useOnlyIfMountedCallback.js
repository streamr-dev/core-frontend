import { useCallback } from 'react'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'

export function useOnlyIfMountedCallback(fn, deps) {
    const isMountedRef = useIsMountedRef()
    return useCallback((...args) => {
        if (!isMountedRef.current) { return undefined }
        return fn(...args)
    }, [fn, isMountedRef, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useOnlyIfMountedCallback
