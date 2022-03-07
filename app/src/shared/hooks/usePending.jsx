// @flow

import { useReducer, useContext, useMemo, useCallback, useLayoutEffect, useRef } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import { Context as PendingContext } from '$shared/contexts/Pending'

function useDiff(val) {
    const lastValRef = useRef(val)
    useLayoutEffect(() => {
        lastValRef.current = val
    }, [val, lastValRef])
    return val - lastValRef.current
}

export function usePending(name: string) {
    const [selfPending, setSelfPending] = useReducer((state, delta: number) => Math.max(0, state + delta), 0)

    const { checkPending, setPending } = useContext(PendingContext)

    const isMounted = useIsMounted()

    const start = useCallback(() => {
        if (isMounted()) {
            setSelfPending(1)
        }
    }, [isMounted])

    const end = useCallback(() => {
        if (isMounted()) {
            setSelfPending(-1)
        }
    }, [isMounted])

    const diff = useDiff(selfPending)
    const pendingRef = useRef(selfPending)
    // update context when diff changes
    useLayoutEffect(() => {
        if (!diff) { return }
        setPending(name, diff)
        pendingRef.current += diff
    }, [diff, setPending, name])

    // undo any outstanding pending counts on unmount
    const setPendingRef = useRef(setPending)
    setPendingRef.current = setPending

    useLayoutEffect(() => () => {
        setPendingRef.current(name, -1 * pendingRef.current)
    }, [name])

    // call start() and end() around some async fn
    const wrap = useCallback(async (fn: Function) => {
        start()
        try {
            return await fn()
        } finally {
            end()
        }
    }, [start, end])

    const isCurrentPending = !!checkPending(name)

    return useMemo(() => ({
        isPending: isCurrentPending,
        start,
        end,
        wrap,
    }), [isCurrentPending, start, end, wrap])
}

export function useAnyPending() {
    const { isPending } = useContext(PendingContext)
    return isPending
}

export default usePending
