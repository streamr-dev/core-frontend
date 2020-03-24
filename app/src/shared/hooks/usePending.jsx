// @flow

import { useContext, useMemo, useCallback, useState, useLayoutEffect, useRef } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import { usePendingContext, Context as PendingContext } from '$shared/contexts/Pending'

function useCounter() {
    const [counter, setCounterState] = useState(0)
    const updateCounter = useCallback((direction: number) => {
        setCounterState((state) => {
            const current = state || 0
            return Math.max(0, current + direction)
        })
    }, [])
    return [counter, updateCounter]
}

function useDiff(val) {
    const lastValRef = useRef(val)
    useLayoutEffect(() => {
        lastValRef.current = val
    }, [val, lastValRef])
    return val - lastValRef.current
}

export function usePending(name: string) {
    const [selfPending, setSelfPending] = useCounter()
    const { checkPending, setPending } = usePendingContext(name)
    const isMounted = useIsMounted()

    const start = useCallback(() => {
        if (!isMounted()) { return }
        setSelfPending(1)
    }, [setSelfPending, isMounted])

    const end = useCallback(() => {
        if (!isMounted()) { return }
        setSelfPending(-1)
    }, [setSelfPending, isMounted])

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
    }, [name, pendingRef, setPendingRef])

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
