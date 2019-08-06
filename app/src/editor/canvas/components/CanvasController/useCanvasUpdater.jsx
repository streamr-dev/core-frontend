import { useMemo, useContext } from 'react'

import useOnlyIfMountedCallback from '$shared/hooks/useOnlyIfMountedCallback'
import { Context as UndoContext } from '$shared/components/UndoContextProvider'

import * as CanvasState from '../../state'

function canvasUpdater(fn) {
    return (canvas) => {
        const nextCanvas = fn(canvas)
        if (nextCanvas === null || nextCanvas === canvas) { return canvas }
        return CanvasState.updateCanvas(nextCanvas)
    }
}

export default function useCanvasUpdater() {
    const { push, replace } = useContext(UndoContext)

    const setCanvas = useOnlyIfMountedCallback((action, fn, done) => {
        push(action, canvasUpdater(fn), done)
    }, [push, canvasUpdater])

    const replaceCanvas = useOnlyIfMountedCallback((fn, done) => {
        replace(canvasUpdater(fn), done)
    }, [push, canvasUpdater])

    return useMemo(() => ({
        setCanvas,
        replaceCanvas,
    }), [setCanvas, replaceCanvas])
}
