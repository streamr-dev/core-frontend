import { useContext, useEffect, useRef, useCallback, useMemo } from 'react'
import useIsMounted from '$shared/hooks/useIsMounted'
import usePending from '$shared/hooks/usePending'

import * as services from '../../services'
import * as CanvasState from '../../state'
import { changedModules, isEqualCanvas } from '../../state/diff'
import useCanvas from './useCanvas'
import useCanvasUpdater from './useCanvasUpdater'
import * as RunController from './Run'

export default function useAutosaveEffect() {
    const runController = useContext(RunController.Context)
    const isMounted = useIsMounted()
    const canvasUpdater = useCanvasUpdater()

    const canvas = useCanvas()
    const currCanvasRef = useRef(canvas)
    const prevCanvas = currCanvasRef.current
    currCanvasRef.current = canvas

    const savingCanvasRef = useRef()
    const lastServerStateRef = useRef()

    const onAutosaveComplete = useCallback((serverCanvas) => {
        const currentCanvas = currCanvasRef.current
        const savingCanvas = savingCanvasRef.current
        lastServerStateRef.current = serverCanvas

        if (isEqualCanvas(currentCanvas, savingCanvas)) {
            // if no changes replace with state from server
            canvasUpdater.replaceCanvas(() => serverCanvas)
            return
        }

        const changed = new Set(changedModules(savingCanvas, currentCanvas))
        let nextCanvas = currentCanvas
        serverCanvas.modules.forEach((m) => {
            // item changed again, don't update this round
            if (changed.has(m.hash)) { return }
            // ignore changes to modules not in serverCanvas
            if (!CanvasState.getModuleIfExists(serverCanvas, m.hash)) { return }
            nextCanvas = CanvasState.updateModule(nextCanvas, m.hash, () => (
                CanvasState.getModule(serverCanvas, m.hash)
            ))
        })
        // do nothing if no changes
        if (nextCanvas === currentCanvas) { return }
        // TODO set updated time
        // TODO do not save deleted canvases
        canvasUpdater.replaceCanvas(() => nextCanvas)
    }, [savingCanvasRef, currCanvasRef, canvasUpdater])

    const { isEditable } = runController
    const { wrap: autosavePendingWrap } = usePending('canvas.AUTOSAVE')

    const canvasChanged = useMemo(() => (
        !isEqualCanvas(prevCanvas, canvas)
    ), [prevCanvas, canvas])

    useEffect(() => {
        if (!isEditable || !canvasChanged) { return }
        const currentCanvas = currCanvasRef.current
        // no autosave if already saving canvas
        if (savingCanvasRef.current === currentCanvas) { return }
        // no autosave if current is equivalent to what we're already saving
        if (isEqualCanvas(savingCanvasRef.current, currentCanvas)) { return }
        // no autosave if last seen server state is equivalent
        if (isEqualCanvas(lastServerStateRef.current, currentCanvas)) { return }
        savingCanvasRef.current = currentCanvas
        autosavePendingWrap(() => services.autosave(currentCanvas))
            .then((...args) => {
                if (!isMounted()) { return }
                if (savingCanvasRef.current !== currentCanvas) { return } // ignore if canvas to be saved changed
                onAutosaveComplete(...args)
                savingCanvasRef.current = undefined
            })
    }, [canvasChanged, autosavePendingWrap, savingCanvasRef, isEditable, isMounted, onAutosaveComplete])
}
