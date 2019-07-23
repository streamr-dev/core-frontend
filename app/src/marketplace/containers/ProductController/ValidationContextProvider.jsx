// @flow

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

type ContextProps = {
    setStatus: (string, string) => {},
    status: Object,
}

const ValidationContext: Context<ContextProps> = React.createContext({})

function useValidationContext(): ContextProps {
    const [status, setStatusState] = useState({})
    const isMountedRef = useIsMountedRef()
    const setStatus: (string, string) => Object = useCallback((name, s) => {
        if (!isMountedRef.current) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState((state) => ({
            ...state,
            [name]: s,
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
