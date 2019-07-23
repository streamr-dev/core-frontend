// @flow

import { useContext, useMemo, useCallback } from 'react'

import { Context as ValidationContext } from './ValidationContextProvider'

export function usePending(name: string) {
    const { status: statusState, setStatus: setStatusState } = useContext(ValidationContext)

    const setStatus = useCallback((status: string) => {
        setStatusState(name, status)
    }, [setStatusState, name])

    const status = statusState[name]

    return useMemo(() => ({
        status,
        setStatus,
    }), [status, setStatus])
}

export default usePending
