// @flow

import { useContext, useMemo, useCallback } from 'react'

import { Context as ValidationContext, type Level } from './ValidationContextProvider'

export function useValidation(name: string) {
    const { status, setStatus: setStatusState, clearStatus: clearStatusState } = useContext(ValidationContext)

    const setStatus = useCallback((level: Level, message: string) => {
        setStatusState(name, level, message)
    }, [setStatusState, name])

    const clearStatus = useCallback(() => {
        clearStatusState(name)
    }, [clearStatusState, name])

    const result = status[name]

    const isValid = useMemo(() => !result, [result])
    const level = useMemo(() => result && result.level, [result])
    const message = useMemo(() => result && result.message, [result])

    return useMemo(() => ({
        isValid,
        level,
        message,
        setStatus,
        clearStatus,
    }), [isValid, level, message, setStatus, clearStatus])
}

export default useValidation
