import { useCallback, useRef, useEffect } from 'react'
import debounce from 'lodash/debounce'

/**
 * Runs debounced onResizeFn on window resize.
 */

function useOnResizeEffect(onResizeFn, timeout = 300) {
    const onResize = useCallback(debounce(() => {
        onResizeFn()
    }, timeout), [onResizeFn])

    const onResizeRef = useRef()

    useEffect(() => {
        if (onResizeRef.current && onResize !== onResizeRef.current) {
            // cancel previous callback
            onResizeRef.current.cancel()
        }
        onResizeRef.current = onResize
        window.addEventListener('resize', onResize)
        return () => {
            // cancel if pending
            onResize.cancel()
            window.removeEventListener('resize', onResize)
        }
    }, [onResize, onResizeRef])
}

/**
 * Returns a callback that runs initPosition once.
 * Will call again on resize
 */

function useInitPosition(initPosition) {
    const isInitializedRef = useRef(false)
    const initPositionCallback = useCallback((init) => {
        if (!init && isInitializedRef.current) { return }
        isInitializedRef.current = true
        initPosition(isInitializedRef)
    }, [initPosition, isInitializedRef])

    useOnResizeEffect(useCallback(() => {
        if (!isInitializedRef.current) { return }
        // reset position to center after resize window
        isInitializedRef.current = false
        initPositionCallback()
    }, [isInitializedRef, initPositionCallback]))

    return initPositionCallback
}

/**
 * Returns callback that sets position to center of container once.
 * Will recenter if window is resized.
 */

export function useInitToCenter({ containerRef, width, height, setPosition }) {
    const initToCenter = useCallback((isInitializedRef) => {
        const { current: container } = containerRef
        if (!container) {
            isInitializedRef.current = false
            return
        }
        const rect = container.getBoundingClientRect()
        setPosition([
            ((rect.width / 2) - (width / 2)),
            ((rect.height / 2) - (height / 2)),
        ])
    }, [containerRef, width, height, setPosition])

    return useInitPosition(initToCenter)
}

/**
 * Returns callback that sets position to provided x, y once,
 * or again once after resize
 */

export function useInitToPosition({ x, y, setPosition }) {
    return useInitPosition(useCallback(() => {
        setPosition([
            x,
            y,
        ])
    }, [setPosition, x, y]))
}
