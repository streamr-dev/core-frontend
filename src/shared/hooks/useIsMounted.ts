import { useCallback, useEffect, useRef } from 'react'

/**
 * @deprecated `useIsMounted` will often lead to confusing
 * behaviour. Alternatives:
 * - in effects: use a local `mounted` flag and unset it on discard (see example),
 * - in callbacks: use `AbortController` and `AbortSignal`.
 * @example
    // `mounted` flag example
    useEffect(() => {
        let mounted = true

        async function fn() {
            await new Promise((resolve) => void setTimeout(resolve))

            if (mounted) {
                // Do stuff!
            }
        }

        fn()

        return () => {
            mounted = false
        }
    }, [])
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
