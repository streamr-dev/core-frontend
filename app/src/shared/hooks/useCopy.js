import { useState, useCallback, useEffect, useMemo, useReducer } from 'react'
import copyToClipboard from 'copy-to-clipboard'

const SUSTAIN_IN_MILLIS = 3000

export default function useCopy() {
    const [isCopied, setIsCopied] = useState(false)

    const [copiedAt, touch] = useReducer((current) => (
        Math.max(current + SUSTAIN_IN_MILLIS, Date.now())
    ), -SUSTAIN_IN_MILLIS)

    const copy = useCallback((value) => {
        copyToClipboard(value)
        touch()
    }, [])

    useEffect(() => {
        if (Date.now() > copiedAt + SUSTAIN_IN_MILLIS) {
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

    return useMemo(() => ({
        copy,
        isCopied,
    }), [
        copy,
        isCopied,
    ])
}
