import { useMemo, useContext } from 'react'

import useMountedCallback from '$shared/utils/useMountedCallback'
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
