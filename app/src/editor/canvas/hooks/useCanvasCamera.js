import { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import { getCanvasBounds, getModuleBounds } from '$editor/shared/utils/bounds'

import { useCameraContext } from '../components/Camera'
import useCanvas from '../components/CanvasController/useCanvas'
import { useCanvasSelection } from '../components/CanvasController/useCanvasSelection'
import { getModuleIfExists } from '../state'

export default function useCanvasCamera() {
    const canvas = useCanvas()
    const camera = useCameraContext()
    const fitCanvas = useCallback(({ padding = 100 } = {}) => {
        if (!canvas) { return }
        const { current: cameraEl } = camera.elRef
        const { width: fitWidth, height: fitHeight } = cameraEl.getBoundingClientRect()
        const boundsWidth = fitWidth - (padding * 2)
        const boundsHeight = fitHeight - (padding * 2)
        const bounds = getCanvasBounds(canvas, {
            // defaults if no bounds
            width: boundsWidth,
            height: boundsHeight,
        })
        return camera.fitBounds({
            ...bounds,
            fitWidth,
            fitHeight,
            padding,
        })
    }, [camera, canvas])

    const panToModule = useCallback(({ hash } = {}) => {
        if (!canvas) { return }
        const m = getModuleIfExists(canvas, hash)
        if (!m) { return }
        const bounds = getModuleBounds(m)
        const padding = 100
        const { current: cameraEl } = camera.elRef
        const { width: fitWidth, height: fitHeight } = cameraEl.getBoundingClientRect()
        return camera.fitBounds({
            ...bounds,
            fitWidth,
            fitHeight,
            padding,
        })
    }, [camera, canvas])

    return useMemo(() => ({
        fitCanvas,
        panToModule,
    }), [fitCanvas, panToModule])
}

// fit camera to canvas on initial load
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

function usePanToSelectionEffect() {
    const canvasSelection = useCanvasSelection()
    const last = canvasSelection.last()
    const canvasCamera = useCanvasCamera()
    const canvasCameraRef = useRef()
    canvasCameraRef.current = canvasCamera

    useEffect(() => {
        if (!last) { return }
        canvasCameraRef.current.panToModule({ hash: last })
    }, [last, canvasCameraRef])
}

export function useCanvasCameraEffects() {
    useFitCanvasOnLoadEffect()
    usePanToSelectionEffect()
}
