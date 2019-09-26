import { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import { getCanvasBounds, getModuleBounds } from '$editor/shared/utils/bounds'

import { useCameraContext } from '../components/Camera'
import useCanvas from '../components/CanvasController/useCanvas'
import { useCanvasSelection } from '../components/CanvasController/useCanvasSelection'
import { getModuleIfExists } from '../state'

export default function useCanvasCamera({ padding: defaultPadding = 100 } = {}) {
    const canvas = useCanvas()
    const camera = useCameraContext()
    // scales & zooms camera to fit camera view - padding
    const fitCanvas = useCallback(({ padding = defaultPadding } = {}) => {
        if (!canvas) { return }
        if (!canvas.modules.length) { return }
        return camera.fitView({
            bounds: getCanvasBounds(canvas),
            padding,
        })
    }, [camera, canvas, defaultPadding])

    // pans camera so module is visible
    const panToModule = useCallback(({ hash, padding = defaultPadding } = {}) => {
        if (!canvas) { return }
        const m = getModuleIfExists(canvas, hash)
        if (!m) { return }
        return camera.panIntoViewIfNeeded({
            bounds: getModuleBounds(m),
            padding,
        })
    }, [camera, canvas, defaultPadding])

    // true if module is in camera view - padding
    const isModuleInView = useCallback(({ hash, padding = defaultPadding } = {}) => {
        if (!canvas) { return }
        const m = getModuleIfExists(canvas, hash)
        if (!m) { return }
        return camera.areBoundsInView({
            bounds: getModuleBounds(m),
            padding,
        })
    }, [camera, canvas, defaultPadding])

    // centers camera on module if not in view
    const panToModuleIfNeeded = useCallback(({ hash } = {}) => {
        const padding = defaultPadding / 2 // use half padding for scrolling into view
        return panToModule({
            hash,
            padding,
        })
    }, [panToModule, defaultPadding])

    return useMemo(() => ({
        fitCanvas,
        panToModule,
        panToModuleIfNeeded,
        isModuleInView,
    }), [
        fitCanvas,
        panToModule,
        panToModuleIfNeeded,
        isModuleInView,
    ])
}

/*
 * Fit camera to canvas on initial load
 */

function useFitCanvasOnLoadEffect() {
    const canvas = useCanvas()
    const canvasCamera = useCanvasCamera()
    const canvasCameraRef = useRef()
    canvasCameraRef.current = canvasCamera

    const [initCamera, setInitCamera] = useState(false)
    const canvasId = canvas ? canvas.id : undefined

    useEffect(() => {
        canvasCameraRef.current.fitCanvas()
    }, [initCamera])

    useEffect(() => {
        if (initCamera === canvasId) { return }
        setInitCamera(canvasId)
    }, [canvasId, initCamera, setInitCamera])
}

/*
 * True when mouse button down
 */

function useIsMouseDown(buttons = 1) {
    const [isMouseDown, setIsMouseDown] = useState(false)
    const onMouseDown = useCallback(() => {
        setIsMouseDown(true)
    }, [setIsMouseDown])

    const onMouseEvent = useCallback((event) => {
        if (event.buttons !== buttons) {
            setIsMouseDown(false)
        }
    }, [setIsMouseDown, buttons])

    useEffect(() => {
        window.addEventListener('mousedown', onMouseDown, true)
        return () => {
            window.removeEventListener('mousedown', onMouseDown, true)
        }
    })

    useEffect(() => {
        if (!isMouseDown) { return }
        window.addEventListener('mousemove', onMouseEvent)
        window.addEventListener('mouseup', onMouseEvent)
        return () => {
            window.removeEventListener('mousemove', onMouseEvent)
            window.removeEventListener('mouseup', onMouseEvent)
        }
    }, [isMouseDown, onMouseEvent])
    return isMouseDown
}

/*
 * When selection changes, an to selected module if needed
 */

function usePanToSelectionEffect() {
    const canvasSelection = useCanvasSelection()
    const last = canvasSelection.last()
    const canvasCamera = useCanvasCamera()
    const canvasCameraRef = useRef()
    canvasCameraRef.current = canvasCamera
    const isMouseDown = useIsMouseDown()

    // pan to selected on mouse up
    useEffect(() => {
        if (!last || isMouseDown) { return }
        canvasCameraRef.current.panToModuleIfNeeded({ hash: last })
    }, [isMouseDown, last, canvasCameraRef])
}

export function useCanvasCameraEffects() {
    useFitCanvasOnLoadEffect()
    usePanToSelectionEffect()
}
