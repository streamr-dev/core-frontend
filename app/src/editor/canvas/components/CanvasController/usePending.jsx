import React, { useContext, useMemo, useCallback, useState } from 'react'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

const PendingContext = React.createContext({})

export function usePending(name) {
    const { pending, setPending } = useContext(PendingContext)

    const start = useCallback(() => {
        setPending(name, 1)
    }, [setPending, name])

    const end = useCallback(() => {
        setPending(name, -1)
    }, [setPending, name])

    const wrap = useCallback(async (fn) => {
        start(name)
        try {
            return await fn()
        } finally {
            end(name)
        }
    }, [name, start, end])

    const isCurrentPending = !!pending[name]

    return useMemo(() => ({
        isPending: isCurrentPending,
        wrap,
    }), [isCurrentPending, wrap])
}

export function useAnyPending() {
    const { pending } = useContext(PendingContext)
    return Object.values(pending).some((isPending) => isPending)
}

export default usePending

function usePendingContext() {
    const [pending, setPendingState] = useState({})
    const isMountedRef = useIsMountedRef()
    const setPending = useCallback((name, direction) => {
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

function PendingContextProvider({ children }) {
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
