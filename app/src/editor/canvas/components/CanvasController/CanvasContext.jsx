import React, { useMemo, useCallback, useContext } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import UndoContainer from '$editor/shared/components/UndoContainer'

import * as CanvasState from '../../state'

const CanvasContext = React.createContext({})

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
        if (nextCanvas === null || nextCanvas === canvas) { return null }
        return CanvasState.updateCanvas(nextCanvas)
    }
}

export function useCanvas() {
    const { state: canvas, push, replace } = useContext(UndoContainer.Context)

    const setCanvas = useMountedCallback((action, fn, done) => {
        push(action, canvasUpdater(fn), done)
    }, [push, canvasUpdater])

    const replaceCanvas = useMountedCallback((fn, done) => {
        replace(canvasUpdater(fn), done)
    }, [push, canvasUpdater])

    const api = useMemo(() => ({
        setCanvas,
        replaceCanvas,
    }), [setCanvas, replaceCanvas])

    return useMemo(() => ({
        canvas,
        api,
    }), [canvas, api])
}

function CanvasContextProvider({ children }) {
    return (
        <CanvasContext.Provider value={useCanvas()}>
            {children || null}
        </CanvasContext.Provider>
    )
}

export {
    CanvasContextProvider as Provider,
    CanvasContext as Context,
}
