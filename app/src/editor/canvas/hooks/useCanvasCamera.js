import { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import { getCanvasBounds } from '$editor/shared/utils/bounds'

import { useCameraContext } from '../components/Camera'
import useCanvas from '../components/CanvasController/useCanvas'

export default function useCanvasCamera() {
    const canvas = useCanvas()
    const camera = useCameraContext()
    const fitCanvas = useCallback(({ padding = 100 } = {}) => {
        if (!canvas) { return }
        const { current: modulesEl } = camera.elRef
        const { width: fitWidth, height: fitHeight } = modulesEl.getBoundingClientRect()
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

    return useMemo(() => ({
        fitCanvas,
    }), [fitCanvas])
}

function useFitCanvasOnLoad() {
    const canvas = useCanvas()
    const canvasCamera = useCanvasCamera()
    const canvasCameraRef = useRef()
    canvasCameraRef.current = canvasCamera

    const [initCamera, setInitCamera] = useState(false)
    const canvasId = canvas ? canvas.id : undefined

    useEffect(() => {
        canvasCameraRef.current.fitCanvas()
    }, [initCamera])

    // initially fit canvas
    useEffect(() => {
        if (initCamera === canvasId) { return }
        setInitCamera(canvasId)
    }, [canvasId, initCamera, setInitCamera])
}

export function useCanvasCameraEffects() {
    useFitCanvasOnLoad()
}
