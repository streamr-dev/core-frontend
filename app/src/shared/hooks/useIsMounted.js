// @flow

import { useCallback } from 'react'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

export default (): (() => boolean) => {
    const isMountedRef = useIsMountedRef()
    return useCallback(() => !!isMountedRef.current, [isMountedRef])
}
