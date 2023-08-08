import { useCallback, useEffect, useRef } from 'react'

/**
 * @deprecated `useIsMounted` will often lead to confusing
 * behaviour. Alternatives:
 * - in effects: use a local `mounted` flag and unset it on discard.
 * - in callbacks: use `AbortController` and `AbortSignal`.
 */
export default function useIsMounted() {
    const ref = useRef(false)

    useEffect(() => {
        ref.current = true

        return () => {
            ref.current = false
        }
    }, [])

    return useCallback(() => ref.current, [])
}
