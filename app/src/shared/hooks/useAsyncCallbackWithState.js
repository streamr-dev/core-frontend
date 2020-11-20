import { useState, useCallback } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'

export default function useAsyncCallbackWithState(callback) {
    const [state, setState] = useState({
        hasStarted: false,
        isLoading: false,
        error: undefined,
        result: undefined,
    })

    const isMounted = useIsMounted()

    const { isLoading } = state

    const run = useCallback(async () => {
        let error
        let result
        if (!isMounted()) { return }
        if (isLoading) { return } // already loading

        setState((s) => ({
            ...s,
            isLoading: true,
            hasStarted: true,
        }))

        try {
            result = await callback()
        } catch (err) {
            error = err
        } finally {
            // only do something if mounted
            if (isMounted()) {
                setState({
                    error,
                    result,
                    isLoading: false,
                    hasStarted: true,
                })
            }
        }
    }, [isLoading, isMounted, callback])
    return [state, run]
}
