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

    // centers camera on module
    const panToModule = useCallback(({ hash } = {}) => {
        if (!canvas) { return }
        const m = getModuleIfExists(canvas, hash)
        if (!m) { return }
        return camera.centerBounds({
            bounds: getModuleBounds(m),
        })
    }, [camera, canvas])

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
        if (isModuleInView({
            hash,
            padding: defaultPadding / 2, // use half padding for scrolling into view
        })) { return }
        return panToModule({ hash })
    }, [isModuleInView, panToModule, defaultPadding])

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
        canvasCameraRef.current.panToModuleIfNeeded({ hash: last })
    }, [last, canvasCameraRef])
}

export function useCanvasCameraEffects() {
    useFitCanvasOnLoadEffect()
    usePanToSelectionEffect()
}
