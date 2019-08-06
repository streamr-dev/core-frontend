// @flow

import { useContext, useMemo, useCallback } from 'react'

import { Context as PendingContext } from '$shared/components/PendingContextProvider'

export function usePending(name: string) {
    const { pending, setPending } = useContext(PendingContext)

    const start = useCallback(() => {
        setPending(name, 1)
    }, [setPending, name])

    const end = useCallback(() => {
        setPending(name, -1)
    }, [setPending, name])

    const wrap = useCallback(async (fn: Function) => {
        start()
        try {
            return await fn()
        } finally {
            end()
        }
    }, [start, end])

    const isCurrentPending = !!pending[name]

    return useMemo(() => ({
        isPending: isCurrentPending,
        start,
        end,
        wrap,
    }), [isCurrentPending, start, end, wrap])
}

export function useAnyPending() {
    const { pending } = useContext(PendingContext)
    return Object.values(pending).some((isPending) => isPending)
}

export default usePending
