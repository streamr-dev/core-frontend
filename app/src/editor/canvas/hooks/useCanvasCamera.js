import { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import { getCanvasBounds, getModuleBounds } from '$editor/shared/utils/bounds'

import { useCameraContext } from '../components/Camera'
import useCanvas from '../components/CanvasController/useCanvas'
import { useCanvasSelection } from '../components/CanvasController/useCanvasSelection'
import { getModuleIfExists } from '../state'

export default function useCanvasCamera({ padding = 100 } = {}) {
    const canvas = useCanvas()
    const camera = useCameraContext()
    const fitCanvas = useCallback(() => {
        if (!canvas) { return }
        if (!canvas.modules.length) { return }
        return camera.fitView({
            bounds: getCanvasBounds(canvas),
            padding,
        })
    }, [camera, canvas, padding])

    const panToModule = useCallback(({ hash } = {}) => {
        if (!canvas) { return }
        const m = getModuleIfExists(canvas, hash)
        if (!m) { return }
        return camera.fitView({
            bounds: getModuleBounds(m),
            padding,
        })
    }, [camera, canvas, padding])

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
