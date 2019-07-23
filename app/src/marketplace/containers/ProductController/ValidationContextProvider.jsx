// @flow

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import { type Status } from './useValidation'

type ContextProps = {
    setStatus: (string, Status) => {},
    status: Object,
}

const ValidationContext: Context<ContextProps> = React.createContext({})

function useValidationContext(): ContextProps {
    const [status, setStatusState] = useState({})
    const isMountedRef = useIsMountedRef()
    const setStatus = useCallback((name: string, newStatus: Status): Object => {
        if (!isMountedRef.current) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState((state) => ({
            ...state,
            [name]: newStatus,
        }))
    }, [setStatusState, isMountedRef])

    return useMemo(() => ({
        setStatus,
        status,
    }), [status, setStatus])
}

type Props = {
    children?: Node,
}

function ValidationContextProvider({ children }: Props) {
    return (
        <ValidationContext.Provider value={useValidationContext()}>
            {children || null}
        </ValidationContext.Provider>
    )
}

export {
    ValidationContextProvider as Provider,
    ValidationContext as Context,
}
