import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cx from 'classnames'
import styles from './Camera.pcss'

import isEditableElement from '$editor/shared/utils/isEditableElement'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

/**
 * Allows interaction events to bubble from this element
 * and be handled by camera controls
 */
export const { cameraControl } = styles

function shouldIgnoreEvent(event) {
    // ignore bubbled, unless has cameraControl style
    return (
        event.currentTarget !== event.target &&
        !event.target.classList.contains(styles.cameraControl)
    )
}

const defaultFit = {
    x: 0,
    y: 0,
    scale: 1,
}

function scaleToFit({ bounds, fit, maxScale = 1, padding = 20 } = {}) {
    const totalPadding = 2 * padding
    const maxWidth = fit.width - totalPadding
    const maxHeight = fit.height - totalPadding
    return Math.min(maxScale, Math.min(maxWidth / bounds.width, maxHeight / bounds.height))
}

function centerBoundsTo({ bounds, fit, scale }) {
    // vertically & horizontally center content
    const offsetY = fit.height / 2
    const offsetX = fit.width / 2

    return {
        x: -((bounds.x + (bounds.width / 2)) * scale) + offsetX,
        y: -((bounds.y + (bounds.height / 2)) * scale) + offsetY,
    }
}

function toPrecision(v, precision = 0) {
    if (!precision) { return v }
    const p = 10 ** precision
    return Math.round((v * p)) / p
}

function fitBoundsTo({ bounds, fit, padding }) {
    const scale = scaleToFit({
        bounds,
        fit,
        padding,
    })

    if (!scale) { return defaultFit }

    const { x, y } = centerBoundsTo({
        bounds,
        fit,
        scale,
    })

    return {
        x,
        y,
        scale,
    }
}

function updateScaleState(s, { x, y, scale: newScale }) {
    const { scale: currentScale } = s

    // adjust for offset created by scale change
    const ratio = (1 - (newScale / currentScale))
    const x2 = s.x + ((x - s.x) * ratio)
    const y2 = s.y + ((y - s.y) * ratio)

    return {
        ...s,
        scale: newScale,
        x: x2,
        y: y2,
    }
}
const defaultCameraOptions = {
    scaleFactor: 0.1,
    scaleLevels: [
        0.1,
        0.25,
        0.5,
        1.0,
        1.25,
        1.50,
        2.0,
        3.0,
    ],
}

function useCameraSimpleApi(opts) {
    const { scaleFactor, scaleLevels } = Object.assign({}, defaultCameraOptions, opts)
    const minScale = scaleLevels[0]
    const maxScale = scaleLevels[scaleLevels.length - 1]
    const [state, setActualState] = useState({
        scale: 1,
        x: 0,
        y: 0,
    })

    const elRef = useRef()

    const { scale, x, y } = state

    // clamps scale
    const setState = useCallback((v) => {
        setActualState((state) => {
            const nextState = (typeof v === 'function') ? v(state) : v
            return {
                ...nextState,
                scale: clamp(nextState.scale, minScale, maxScale),
            }
        })
    }, [setActualState, minScale, maxScale])

    // updates scale of camera, centers scaling on x,y
    const updateScale = useCallback(({ x, y, delta }) => {
        setState((s) => {
            const factor = Math.abs(scaleFactor * (delta / 120))
            const actualScaleFactor = delta < 0 ? 1 + factor : 1 - factor
            return updateScaleState(s, {
                x,
                y,
                scale: clamp(s.scale * actualScaleFactor, minScale, maxScale),
            })
        })
    }, [setState, scaleFactor, minScale, maxScale])

    // init needed to reset last values before starting pan
    const initUpdatePosition = useCallback(({ x, y }) => {
        setState((s) => ({
            ...s,
            lastX: x,
            lastY: y,
        }))
    }, [setState])

    // changes current camera offset i.e. pans camera
    const updatePosition = useCallback(({ x, y }) => {
        setState(({ lastX = x, lastY = y, ...s }) => ({
            ...s,
            lastX: x,
            lastY: y,
            x: s.x + (x - lastX),
            y: s.y + (y - lastY),
        }))
    }, [setState])

    // set scale to value, centered on middle of camera el
    const setScale = useCallback((value) => {
        setState((s) => {
            const rect = elRef.current.getBoundingClientRect()
            return updateScaleState(s, {
                x: rect.left + (rect.width / 2),
                y: rect.top + (rect.height / 2),
                scale: clamp(toPrecision(value, 2), minScale, maxScale),
            })
        })
    }, [setState, minScale, maxScale])

    // zoom in to next largest scale level
    const zoomIn = useCallback(() => {
        const currentScale = toPrecision(scale, 2)
        const nextLevel = scaleLevels.find((v) => v > currentScale) || scale
        setScale(nextLevel)
    }, [setScale, scale, scaleLevels])

    // zoom out to next largest scale level
    const zoomOut = useCallback(() => {
        const currentScale = toPrecision(scale, 2)
        const nextLevel = scaleLevels.slice().reverse().find((v) => v < currentScale) || scale
        setScale(nextLevel)
    }, [setScale, scale, scaleLevels])

    const pan = useCallback(({ x = 0, y = 0 } = {}) => {
        setState((s) => ({
            ...s,
            x: s.x + x,
            y: s.y + y,
        }))
    }, [setState])

    // fit camera to supplied bounds
    const fitBounds = useCallback((opts) => {
        setState((s) => ({
            ...s,
            ...fitBoundsTo(opts),
        }))
    }, [setState])

    // fit supplied bounds to camera element bounds
    const fitView = useCallback((opts) => {
        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()
        return fitBounds({
            ...opts,
            fit: {
                width,
                height,
            },
        })
    }, [fitBounds, elRef])

    // move bounds into center
    const centerBounds = useCallback(({ bounds }) => {
        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()

        return setState((s) => ({
            ...s,
            ...centerBoundsTo({
                bounds,
                fit: {
                    width,
                    height,
                },
                scale: s.scale,
            }),
        }))
    }, [setState, elRef])

    const areBoundsInView = useCallback(({ bounds, padding = 0 }) => {
        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()
        return (
            ((bounds.x * scale) + x) >= padding
            && ((bounds.y * scale) + y) >= padding
            && (((bounds.x + bounds.width) * scale) + x) < (width - padding)
            && (((bounds.y + bounds.height) * scale) + y) < (height - padding)
        )
    }, [scale, x, y])

    // minimally move bounds into view, if not already in view
    const panIntoViewIfNeeded = useCallback(({ bounds, padding }) => {
        const inView = areBoundsInView({
            bounds,
            padding,
        })
        if (inView) { return }

        const { current: cameraEl } = elRef
        const { width, height } = cameraEl.getBoundingClientRect()
        const [overLeft, overTop, overRight, overBottom] = [
            padding - ((bounds.x * scale) + x),
            padding - ((bounds.y * scale) + y),
            (((bounds.x + bounds.width) * scale) + x) - (width - padding),
            (((bounds.y + bounds.height) * scale) + y) - (height - padding),
        ].map((v) => Math.max(0, v))

        // prioritise top & left offsets over right & bottom
        const offsetX = overLeft > 0 ? overLeft : -overRight
        const offsetY = overTop > 0 ? overTop : -overBottom

        return setState((s) => ({
            ...s,
            x: s.x + offsetX,
            y: s.y + offsetY,
        }))
    }, [setState, scale, x, y, areBoundsInView, elRef])

    // convert bounds in px coordinates to camera coordinates
    const viewToCameraBounds = useCallback((bounds) => {
        const canvasX = (bounds.x - x) / scale
        const canvasY = (bounds.y - y) / scale
        return {
            x: canvasX,
            y: canvasY,
            width: bounds.width / scale,
            height: bounds.height / scale,
        }
    }, [x, y, scale])

    return useMemo(() => ({
        ...state,
        elRef,
        updateScale,
        initUpdatePosition,
        updatePosition,
        setState,
        zoomIn,
        zoomOut,
        pan,
        setScale,
        fitBounds,
        fitView,
        centerBounds,
        areBoundsInView,
        viewToCameraBounds,
        panIntoViewIfNeeded,
    }), [
        state,
        setState,
        updateScale,
        updatePosition,
        initUpdatePosition,
        zoomIn,
        zoomOut,
        pan,
        setScale,
        fitBounds,
        fitView,
        centerBounds,
        areBoundsInView,
        viewToCameraBounds,
        panIntoViewIfNeeded,
    ])
}

const defaultCameraConfig = {
    config: {
        mass: 1,
        friction: 62,
        tension: 700,
        precision: 0.00001,
    },
}

function useCameraSpringApi() {
    const camera = useCameraSimpleApi()
    const { x, y, scale } = camera
    const [cameraConfig, setCameraConfig] = useState(defaultCameraConfig)
    const onSpring = useCallback(() => ({
        x,
        y,
        scale,
        ...cameraConfig,
    }), [x, y, scale, cameraConfig])

    const [spring, set, stop] = useSpring(onSpring)

    set({
        x,
        y,
        scale,
        ...cameraConfig,
    })

    const springRef = useRef()
    springRef.current = spring

    const stopRef = useRef()
    stopRef.current = stop

    const getSpring = useCallback(() => (
        springRef.current
    ), [springRef])

    const getCurrentScale = useCallback(() => (
        springRef.current.scale.getValue()
    ), [springRef])

    const resetCameraConfig = useCallback(() => (
        setCameraConfig(defaultCameraConfig)
    ), [setCameraConfig])

    const stopSpring = useCallback(() => (
        stopRef.current()
    ), [stopRef])

    return useMemo(() => ({
        resetCameraConfig,
        defaultCameraConfig,
        setCameraConfig,
        getCurrentScale,
        getSpring,
        stopSpring,
        ...camera,
    }), [getSpring, camera, setCameraConfig, getCurrentScale, resetCameraConfig, stopSpring])
}

export const CameraContext = React.createContext({})

export function useCameraContext() {
    return useContext(CameraContext)
}

export function CameraProvider({ onChange, children, ...props }) {
    const camera = useCameraSpringApi(props)
    useEffect(() => {
        if (typeof onChange !== 'function') { return }
        onChange(camera)
    }, [onChange, camera])

    return (
        <CameraContext.Provider value={camera}>
            {children}
        </CameraContext.Provider>
    )
}

function useWheelControls(elRef) {
    const { updateScale } = useCameraContext()
    const onChangeScale = useCallback((event) => {
        if (isEditableElement(event.target)) { return }
        event.preventDefault()
        const el = elRef.current
        const { deltaY: delta } = event
        if (delta === 0) { return }
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        updateScale({
            x,
            y,
            delta,
        })
    }, [elRef, updateScale])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('wheel', onChangeScale)
        return () => {
            el.removeEventListener('wheel', onChangeScale)
        }
    }, [elRef, onChangeScale])
}

function usePanControls(elRef) {
    const { initUpdatePosition, updatePosition, setCameraConfig } = useCameraContext()
    const [isPanning, setPanning] = useState(false)

    const startPanning = useCallback((event) => {
        if (event.buttons !== 1) { return }
        if (shouldIgnoreEvent(event)) { return }
        if (isPanning) { return }
        event.stopPropagation()
        const el = elRef.current
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        initUpdatePosition({
            x,
            y,
        })
        setPanning(true)
    }, [elRef, isPanning, initUpdatePosition, setPanning])

    useEffect(() => {
        setCameraConfig((s) => ({
            ...s,
            immediate: isPanning,
        }))
    }, [setCameraConfig, isPanning])

    const stopPanning = useCallback(() => {
        if (!isPanning) { return }
        setPanning(false)
    }, [isPanning])

    const pan = useCallback((event) => {
        if (!isPanning) { return }
        if (event.buttons !== 1) {
            stopPanning(event)
            return
        }

        const el = elRef.current
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        updatePosition({
            x,
            y,
        })
    }, [isPanning, elRef, stopPanning, updatePosition])

    useEffect(() => {
        if (!isPanning) { return }
        window.addEventListener('mousemove', pan)
        window.addEventListener('mouseup', stopPanning)
        return () => {
            window.removeEventListener('mousemove', pan)
            window.removeEventListener('mouseup', stopPanning)
        }
    }, [isPanning, pan, stopPanning])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('mousedown', startPanning)
        return () => {
            el.removeEventListener('mousedown', startPanning)
        }
    }, [elRef, startPanning])
}

function useKeyboardPanControls({ panAmount = 25 } = {}) {
    const { pan } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        if (isEditableElement(event.target)) { return }
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            event.preventDefault()
            pan({ x: panAmount })
        }
        if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            event.preventDefault()
            pan({ x: -panAmount })
        }
        if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
            event.preventDefault()
            pan({ y: panAmount })
        }

        if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
            event.preventDefault()
            pan({ y: -panAmount })
        }
    }, [pan, panAmount])
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    })
}

function useKeyboardZoomControls() {
    const { zoomIn, zoomOut } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        if (isEditableElement(event.target)) { return }
        const meta = (event.metaKey || event.ctrlKey)
        if (event.key === '=' && meta) {
            event.preventDefault()
            zoomIn()
        }
        if (event.key === '-' && meta) {
            event.preventDefault()
            zoomOut()
        }
    }, [zoomIn, zoomOut])
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    })
}

function useCameraSpring() {
    const camera = useCameraContext()
    return camera.getSpring()
}

export default function Camera({ className, children }) {
    const elRef = useRef()
    const camera = useCameraContext()
    useEffect(() => {
        camera.elRef.current = elRef.current
    })

    useWheelControls(elRef)
    usePanControls(elRef)
    useKeyboardPanControls()
    useKeyboardZoomControls()

    const spring = useCameraSpring()

    return (
        <div className={cx(className, styles.root)} ref={elRef}>
            <animated.div
                className={styles.scaleLayer}
                style={{
                    transform: to([spring.x, spring.y, spring.scale], (x, y, scale) => (
                        `translate(${x}px, ${y}px) scale(${scale})`
                    )),
                }}
            >
                {children}
            </animated.div>
        </div>
    )
}
