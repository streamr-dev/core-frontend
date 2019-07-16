// @flow

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import copyToClipboard from 'copy-to-clipboard'

export function useCopy() {
    const [isCopied, setCopied] = useState(false)
    const timeOutId = useRef(null)

    const reset = useCallback(() => {
        clearTimeout(timeOutId.current)
        timeOutId.current = null
    }, [])

    const copy = useCallback((value: string) => {
        if (!isCopied) {
            copyToClipboard(value)
            setCopied(true)

            timeOutId.current = setTimeout(() => {
                setCopied(false)
            }, 3000)
        }
    }, [isCopied])

    useEffect(() => () => {
        reset()
    }, [reset])

    return useMemo(() => ({
        isCopied,
        copy,
        reset,
    }), [isCopied, copy, reset])
}

export default useCopy
