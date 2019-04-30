import React, { useMemo, useCallback, useState } from 'react'

const CanvasLoadingContext = React.createContext([])

export function usePending() {
    const [pending, setPending] = useState(0)

    const start = useCallback(() => {
        setPending((p) => p + 1)
    }, [setPending])

    const end = useCallback(() => {
        setPending((p) => Math.min(p - 1, 0))
    }, [setPending])

    const api = useMemo(() => ({
        start,
        end,
    }), [start, end])

    return useMemo(() => ([
        pending,
        api,
    ]), [pending, api])
}

function CanvasLoadingContextProvider({ children }) {
    return (
        <CanvasLoadingContext.Provider value={usePending()}>
            {children || null}
        </CanvasLoadingContext.Provider>
    )
}

export {
    CanvasLoadingContextProvider as Provider,
    CanvasLoadingContext as Context,
}
