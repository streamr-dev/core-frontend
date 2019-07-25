// @flow

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'

type ContextProps = {
    setPending: (string, number) => {},
    pending: Object,
}

const PendingContext: Context<ContextProps> = React.createContext({})

function usePendingContext(): ContextProps {
    const [pending, setPendingState] = useState({})
    const isMountedRef = useIsMountedRef()
    const setPending: (string, number) => Object = useCallback((name, direction) => {
        if (!isMountedRef.current) { return }
        if (!name) {
            throw new Error('pending needs a name')
        }

        setPendingState((state) => {
            const current = state[name] || 0
            return {
                ...state,
                [name]: Math.max(0, current + direction),
            }
        })
    }, [setPendingState, isMountedRef])

    return useMemo(() => ({
        setPending,
        pending,
    }), [pending, setPending])
}

type Props = {
    children?: Node,
}

function PendingContextProvider({ children }: Props) {
    return (
        <PendingContext.Provider value={usePendingContext()}>
            {children || null}
        </PendingContext.Provider>
    )
}

export {
    PendingContextProvider as Provider,
    PendingContext as Context,
}
