// @flow

import { useState, useEffect, useCallback } from 'react'
import { type UseStateTuple } from '$shared/flowtype/common-types'
import useIsMounted from '$shared/hooks/useIsMounted'

export default () => {
    const [failure, setFailure]: UseStateTuple<any> = useState()

    const isMounted = useIsMounted()

    useEffect(() => {
        if (failure) {
            throw failure
        }
    }, [failure])

    return useCallback((value: any) => {
        if (isMounted()) {
            setFailure(value)
        }
    }, [isMounted])
}
