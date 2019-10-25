import React, { useRef, useState, useCallback, useLayoutEffect, useEffect, useMemo, useContext } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cx from 'classnames'
import styles from './Camera.pcss'

import isEditableElement from '$editor/shared/utils/isEditableElement'

import { useThrottled } from '$shared/hooks/wrapCallback'
import * as State from './state'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

/**
 * Allows interaction events to bubble from this element
 * and be handled by camera controls
 */
export const { cameraControl, noCameraControl } = styles

function useStateCallback(setState, fn) {
    return useCallback((...args) => (
        setState((s) => fn(s, ...args))
    ), [setState, fn])
}

function useCameraSimpleApi(opts) {
    const elRef = useRef()
    const [state, setActualState] = useState(State.createCamera({
        ...opts,
        elRef,
    }))

    const stateRef = useRef()
    stateRef.current = state

    const updateScale = useStateCallback(setActualState, State.updateScale)
    const setPosition = useStateCallback(setActualState, State.setPosition)
    const pan = useStateCallback(setActualState, State.pan)
    const setState = useStateCallback(setActualState, State.setState)
    const zoomIn = useStateCallback(setActualState, State.zoomIn)
    const zoomOut = useStateCallback(setActualState, State.zoomOut)
    const setScale = useStateCallback(setActualState, State.setScale)
    const fitBounds = useStateCallback(setActualState, State.fitBounds)
    const fitView = useStateCallback(setActualState, State.fitView)
    const centerBounds = useStateCallback(setActualState, State.centerBounds)
    const panIntoViewIfNeeded = useStateCallback(setActualState, State.panIntoViewIfNeeded)

    const areBoundsInView = useCallback((...args) => State.areBoundsInView(stateRef.current, ...args), [stateRef])
    const cameraToWorldBounds = useCallback((...args) => State.cameraToWorldBounds(stateRef.current, ...args), [stateRef])
    const cameraToWorldPoint = useCallback((...args) => State.cameraToWorldPoint(stateRef.current, ...args), [stateRef])
    const eventToWorldPoint = useCallback((...args) => State.eventToWorldPoint(stateRef.current, ...args), [stateRef])
    const shouldIgnoreEvent = useCallback((...args) => State.shouldIgnoreEvent(stateRef.current, ...args), [stateRef])

    return useMemo(() => ({
        ...state,
        state,
        updateScale,
        setPosition,
        setState,
        zoomIn,
        zoomOut,
        pan,
        setScale,
        fitBounds,
        fitView,
        centerBounds,
        areBoundsInView,
        cameraToWorldBounds,
        cameraToWorldPoint,
        panIntoViewIfNeeded,
        eventToWorldPoint,
        shouldIgnoreEvent,
    }), [
        state,
        setState,
        updateScale,
        setPosition,
        zoomIn,
        zoomOut,
        pan,
        setScale,
        fitBounds,
        fitView,
        centerBounds,
        areBoundsInView,
        cameraToWorldBounds,
        cameraToWorldPoint,
        panIntoViewIfNeeded,
        eventToWorldPoint,
        shouldIgnoreEvent,
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
    const {
        x,
        y,
        scale,
        scaleFactor,
        setState,
        minScale,
        maxScale,
    } = camera

    const destStateRef = useRef({
        x,
        y,
        scale,
    })

    const springRef = useRef()
    const commitSpringState = useCallback(() => {
        setState((s) => ({
            ...s,
            x: springRef.current.x.value,
            y: springRef.current.y.value,
            scale: springRef.current.scale.value,
        }))
    }, [setState])

    const commitDestState = useCallback(() => {
        setState((s) => ({
            ...s,
            ...destStateRef.current,
        }))
    }, [setState])

    const [cameraConfig, setCameraConfig] = useState({
        ...defaultCameraConfig,
    })

    const onSpring = () => ({
        x,
        y,
        scale,
        ...cameraConfig,
    })

    const [spring, set, stop] = useSpring(onSpring)

    const lastRef = useRef()

    springRef.current = spring
    const isTransitioning = !(spring.x.done && spring.y.done && spring.scale.done)

    useLayoutEffect(() => {
        // update dest state to current state if not transitioning
        if (isTransitioning) { return }
        destStateRef.current = {
            x,
            y,
            scale,
        }
        set({
            x,
            y,
            scale,
            ...cameraConfig,
        })
    }, [x, y, set, scale, cameraConfig, isTransitioning])

    const startSmoothPan = useCallback(({ x, y }) => {
        commitSpringState()
        lastRef.current = {
            lastX: x,
            lastY: y,
        }
    }, [commitSpringState])

    const smoothPan = useCallback(({ x: px, y: py }) => {
        const { lastX = px, lastY = py } = lastRef.current || {}
        const { x, y } = destStateRef.current
        destStateRef.current = {
            ...destStateRef.current,
            scale: springRef.current.scale.value,
            x: x + (px - lastX),
            y: y + (py - lastY),
        }
        lastRef.current = {
            lastX: px,
            lastY: py,
        }
        set({
            ...destStateRef.current,
            ...cameraConfig,
        })
    }, [set, cameraConfig])

    const smoothUpdateScale = useCallback(({ x, y, delta }) => {
        const factor = Math.abs(scaleFactor * (delta / 120))
        const actualScaleFactor = delta < 0 ? 1 + factor : 1 - factor
        const currentScale = destStateRef.current.scale

        destStateRef.current = State.updateScaleState(destStateRef.current, {
            x,
            y,
            scale: clamp(currentScale * actualScaleFactor, minScale, maxScale),
        })
        set({
            ...destStateRef.current,
            ...cameraConfig,
        })
    }, [set, cameraConfig, scaleFactor, minScale, maxScale])

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
        smoothPan,
        startSmoothPan,
        commitSpringState,
        commitDestState,
        smoothUpdateScale,
    }), [
        getSpring,
        startSmoothPan,
        smoothPan,
        commitSpringState,
        commitDestState,
        smoothUpdateScale,
        camera,
        setCameraConfig,
        getCurrentScale,
        resetCameraConfig,
        stopSpring,
    ])
}

export const CameraContext = React.createContext({})

export function useCameraState() {
    const { x, y, scale, getCurrentScale } = useContext(CameraContext)
    return useMemo(() => ({
        x,
        y,
        scale,
        getCurrentScale,
    }), [x, y, scale, getCurrentScale])
}

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
    const { smoothUpdateScale, commitDestState, shouldIgnoreEvent } = useCameraContext()

    const commitDebounced = useThrottled(useCallback(() => {
        commitDestState()
    }, [commitDestState]), 500)

    const onChangeScale = useCallback((event) => {
        if (shouldIgnoreEvent(event)) { return }
        event.preventDefault()
        const el = elRef.current
        const { deltaY: delta } = event
        if (delta === 0) { return }
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        smoothUpdateScale({
            x,
            y,
            delta,
        })
        commitDebounced()
    }, [elRef, commitDebounced, smoothUpdateScale, shouldIgnoreEvent])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('wheel', onChangeScale)
        return () => {
            el.removeEventListener('wheel', onChangeScale)
        }
    }, [elRef, onChangeScale])
}

function usePanControls(elRef) {
    const { smoothPan, startSmoothPan, setCameraConfig, commitSpringState } = useCameraContext()
    const [isPanning, setPanning] = useState(false)

    const startPanning = useCallback((event) => {
        if (event.buttons !== 1) { return }
        // ignore bubbled, unless has cameraControl style
        if (
            event.currentTarget !== event.target &&
            !event.target.classList.contains(styles.cameraControl)
        ) { return }

        if (isPanning) { return }
        event.stopPropagation()
        const el = elRef.current
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = event.clientX - left
        const y = event.clientY - top
        setCameraConfig((s) => ({
            ...s,
            immediate: true,
        }))
        startSmoothPan({
            x,
            y,
        })

        setPanning(true)
    }, [elRef, setCameraConfig, isPanning, startSmoothPan, setPanning])

    const stopPanning = useCallback(() => {
        if (!isPanning) { return }
        commitSpringState()
        setCameraConfig((s) => ({
            ...s,
            immediate: false,
        }))
        setPanning(false)
    }, [isPanning, setCameraConfig, commitSpringState])

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
        smoothPan({
            x,
            y,
        })
    }, [isPanning, elRef, stopPanning, smoothPan])

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
    const { pan, shouldIgnoreEvent } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        if (shouldIgnoreEvent(event)) { return }
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            pan({ x: panAmount })
        }
        if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            event.preventDefault()
            event.stopPropagation()
            pan({ x: -panAmount })
        }
        if ((!event.shiftKey && event.key === 'ArrowUp') || event.key.toLowerCase() === 'w') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            pan({ y: panAmount })
        }

        if ((!event.shiftKey && event.key === 'ArrowDown') || event.key.toLowerCase() === 's') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            pan({ y: -panAmount })
        }
    }, [pan, panAmount, shouldIgnoreEvent])
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])
}

function useKeyboardZoomControls() {
    const { zoomIn, zoomOut, shouldIgnoreEvent } = useCameraContext()
    const onKeyDown = useCallback((event) => {
        if (shouldIgnoreEvent(event)) { return }
        const meta = (event.metaKey || event.ctrlKey)
        if (((event.key === '+' || event.key === '=') && meta) || (event.key === 'ArrowUp' && event.shiftKey)) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            zoomIn()
        }
        if ((event.key === '-' && meta) || (event.key === 'ArrowDown' && event.shiftKey)) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            zoomOut()
        }
    }, [zoomIn, zoomOut, shouldIgnoreEvent])
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])
}

function useCameraSpring() {
    const camera = useCameraContext()
    return camera.getSpring()
}

export default function Camera({ className, children }) {
    const elRef = useRef()
    const camera = useCameraContext()
    useLayoutEffect(() => {
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
