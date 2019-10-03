import { useMemo, useCallback, useEffect, useState, useRef, useContext } from 'react'
import { getCanvasBounds, getModuleBounds } from '$editor/shared/utils/bounds'
import { useThrottled } from '$shared/hooks/wrapCallback'
import isEditableElement from '$editor/shared/utils/isEditableElement'

import { useCameraContext } from '../components/Camera'
import { DragDropContext } from '../components/DragDropContext'
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
    const panToModule = useCallback(({ hash, padding = defaultPadding, offset } = {}) => {
        if (!canvas) { return }
        const m = getModuleIfExists(canvas, hash)
        if (!m) { return }
        let bounds = getModuleBounds(m)
        if (offset) {
            bounds = {
                ...bounds,
                x: bounds.x + offset.x,
                y: bounds.y + offset.y,
            }
        }

        return camera.panIntoViewIfNeeded({
            bounds,
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

    // by default uses half default padding for scrolling into view
    const panToModuleIfNeeded = useCallback(({ hash, offset, padding = defaultPadding / 2 } = {}) => {
        panToModule({
            hash,
            padding,
            offset,
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

function useIsMouseDown({ buttons = 1, ref }) {
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
        const el = ref.current
        el.addEventListener('mousedown', onMouseDown, true)
        return () => {
            el.removeEventListener('mousedown', onMouseDown, true)
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

function useKeyboardZoomControls() {
    const { fitCanvas } = useCanvasCamera()
    const { elRef, setScale } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        const { current: el } = elRef
        if (isEditableElement(event.target) || (!el.contains(event.target) && event.target !== document.body)) { return }
        const meta = (event.metaKey || event.ctrlKey)

        if (event.key === '0' && meta) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            setScale(1)
        }

        if (event.key === '1' && meta) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            fitCanvas()
        }
    }, [fitCanvas, setScale, elRef])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])
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
    const isMouseDown = useIsMouseDown({ ref: useRef(window) })

    // pan to selected on mouse up
    useEffect(() => {
        if (!last) { return }
        canvasCameraRef.current.panToModuleIfNeeded({ hash: last })
    }, [isMouseDown, last, canvasCameraRef])
}

function usePanEdgesOnDragEffect() {
    const dragDrop = useContext(DragDropContext)
    const camera = useCameraContext()
    const { setCameraConfig, resetCameraConfig, stopSpring } = camera
    const { isDragging, data, getDiff } = dragDrop
    const canvasCamera = useCanvasCamera()
    const { moduleHash } = data || {}

    const onMouseMove = useThrottled(useCallback(() => {
        if (moduleHash != null) {
            const diff = getDiff()
            canvasCamera.panToModuleIfNeeded({
                padding: 20,
                hash: moduleHash,
                offset: {
                    x: diff.x,
                    y: diff.y,
                },
            })
        }
    }, [canvasCamera, moduleHash, getDiff]), 1000)

    useEffect(() => {
        if (!isDragging) { return }
        setCameraConfig((s) => ({
            ...s,
            config: {
                ...s.config,
                friction: 120,
                tension: 500,
            },
        }))
        return () => {
            resetCameraConfig()
            stopSpring()
        }
    }, [setCameraConfig, stopSpring, resetCameraConfig, isDragging])

    useEffect(() => {
        if (!isDragging) { return }
        window.addEventListener('mousemove', onMouseMove, true)
        return () => {
            window.removeEventListener('mousemove', onMouseMove, true)
        }
    }, [isDragging, dragDrop, onMouseMove])
}

export function useCanvasCameraEffects() {
    useFitCanvasOnLoadEffect()
    usePanToSelectionEffect()
    useKeyboardZoomControls()
}

export function useCanvasCameraDragEffects() {
    usePanEdgesOnDragEffect()
}
