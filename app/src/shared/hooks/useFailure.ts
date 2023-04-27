import { useState, useCallback } from 'react'
import '$shared/types/common-types'
import useIsMounted from '$shared/hooks/useIsMounted'
export default () => {
    const [failure, setFailure] = useState<any>()
    const isMounted = useIsMounted()

    if (failure) {
        throw failure
    }

    return useCallback(
        (value: any) => {
            if (isMounted()) {
                setFailure(value)
            }
        },
        [isMounted],
    )
}
