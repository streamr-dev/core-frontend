// @flow

import { useContext, useMemo, useCallback } from 'react'

import { Context as ValidationContext } from './ValidationContextProvider'

export const OK = 'ok'
export const WARNING = 'warning'
export const ERROR = 'error'

export type Status = 'ok' | 'warning' | 'error'

export function useValidation(name: string) {
    const { status: statusState, setStatus: setStatusState } = useContext(ValidationContext)

    const setStatus = useCallback((status: Status) => {
        setStatusState(name, status)
    }, [setStatusState, name])

    const status = statusState[name] || ERROR

    return useMemo(() => ({
        status,
        setStatus,
    }), [status, setStatus])
}

export default useValidation
