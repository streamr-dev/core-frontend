import { useMemo, useCallback, useContext } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import UndoContainer from '$editor/shared/components/UndoContainer'

import * as CanvasState from '../../state'

function useMountedCallback(fn, deps) {
    const isMountedRef = useIsMountedRef()
    return useCallback((...args) => {
        if (!isMountedRef.current) { return }
        return fn(...args)
    }, [fn, isMountedRef, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
}

function canvasUpdater(fn) {
    return (canvas) => {
        const nextCanvas = fn(canvas)
        if (nextCanvas === null || nextCanvas === canvas) { return canvas }
        return CanvasState.updateCanvas(nextCanvas)
    }
}

export default function useCanvasUpdater() {
    const { push, replace } = useContext(UndoContainer.Context)

    const setCanvas = useMountedCallback((action, fn, done) => {
        push(action, canvasUpdater(fn), done)
    }, [push, canvasUpdater])

    const replaceCanvas = useMountedCallback((fn, done) => {
        replace(canvasUpdater(fn), done)
    }, [push, canvasUpdater])

    return useMemo(() => ({
        setCanvas,
        replaceCanvas,
    }), [setCanvas, replaceCanvas])
}
