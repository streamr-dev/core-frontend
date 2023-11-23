import { useCallback, useEffect, useRef } from 'react'

/**
 * @requires Basic knowledge of what you're doing. ;) Checking on being mounted often
 * leads to unexpected behaviour because it may not be the right condition to rely on.
 *
 * Better-control-giving alternatives worth looking into:
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
