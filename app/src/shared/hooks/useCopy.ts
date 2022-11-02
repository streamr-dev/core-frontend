import { useState, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import copyToClipboard from 'copy-to-clipboard'

const SUSTAIN_IN_MILLIS = 3000

const useCopy = (onAfterCopied?: (value: string) => void): { copy: (value: string) => void; isCopied: boolean } => {
    const [isCopied, setIsCopied] = useState(false)
    const onAfterCopiedRef = useRef(onAfterCopied)
    useEffect(() => {
        onAfterCopiedRef.current = onAfterCopied
    }, [onAfterCopied])
    const [copiedAt, touch] = useReducer(
        (
            current: number,
            now: number, // Throttle updates to `copiedAt`.
        ) => (current + SUSTAIN_IN_MILLIS > now ? current : now),
        Number.NEGATIVE_INFINITY,
    )
    const copy = useCallback((value: string) => {
        copyToClipboard(value)

        if (typeof onAfterCopiedRef.current === 'function') {
            onAfterCopiedRef.current(value)
        }

        touch(Date.now())
    }, [])
    useEffect(() => {
        if (copiedAt < 0) {
            return () => {}
        }

        setIsCopied(true)
        const timeout = setTimeout(() => {
            setIsCopied(false)
        }, SUSTAIN_IN_MILLIS)
        return () => {
            clearTimeout(timeout)
        }
    }, [copiedAt])
    return useMemo(
        () => ({
            copy,
            isCopied,
        }),
        [copy, isCopied],
    )
}

export default useCopy
