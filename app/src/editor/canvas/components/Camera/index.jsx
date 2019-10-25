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

const defaultCameraConfig = {
    mass: 1,
    friction: 62,
    tension: 700,
    precision: 0.00001,
}

function useCameraSimpleApi(opts) {
    const elRef = useRef()
    const [state, setActualState] = useState(State.createCamera({
        ...opts,
        elRef,
    }))

    const stateRef = useRef()
    stateRef.current = state

    const [cameraConfig, setCameraConfig] = useState(defaultCameraConfig)

    const cameraConfigRef = useRef()
    cameraConfigRef.current = cameraConfig

    const destStateRef = useRef()

    const commit = useCallback(() => {
        setActualState((s) => ({
            ...s,
            x: destStateRef.current.x,
            y: destStateRef.current.y,
            scale: destStateRef.current.scale,
        }))
    }, [])

    const commitThrottled = useThrottled(useCallback(() => {
        commit()
    }, [commit]), 500)

    // init destState after creating destStateRef + commit
    if (!destStateRef.current) {
        destStateRef.current = {
            x: state.x,
            y: state.y,
            scale: state.scale,
            config: cameraConfig,
            onRest: commit,
        }
    }

    const onSpring = () => destStateRef.current

    const [spring, set, stop] = useSpring(onSpring)

    const springRef = useRef()
    springRef.current = spring

    const setSpringState = useCallback((v) => {
        const { x, y, scale } = (typeof v === 'function') ? v({
            ...stateRef.current,
            ...destStateRef.current,
        }) : v
        destStateRef.current = {
            x,
            y,
            scale,
            config: cameraConfigRef.current,
        }
        set(destStateRef.current)
        commitThrottled()
    }, [set, commitThrottled])

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

    const updateScale = useStateCallback(setSpringState, State.updateScale)
    const setPosition = useStateCallback(setSpringState, State.setPosition)
    const pan = useStateCallback(setSpringState, State.pan)
    const setState = useStateCallback(setSpringState, State.setState)
    const zoomIn = useStateCallback(setSpringState, State.zoomIn)
    const zoomOut = useStateCallback(setSpringState, State.zoomOut)
    const setScale = useStateCallback(setSpringState, State.setScale)
    const fitBounds = useStateCallback(setSpringState, State.fitBounds)
    const fitView = useStateCallback(setSpringState, State.fitView)
    const centerBounds = useStateCallback(setSpringState, State.centerBounds)
    const panIntoViewIfNeeded = useStateCallback(setSpringState, State.panIntoViewIfNeeded)

    const areBoundsInView = useCallback((...args) => State.areBoundsInView(stateRef.current, ...args), [stateRef])
    const cameraToWorldBounds = useCallback((...args) => State.cameraToWorldBounds(stateRef.current, ...args), [stateRef])
    const cameraToWorldPoint = useCallback((...args) => State.cameraToWorldPoint(stateRef.current, ...args), [stateRef])
    const eventToWorldPoint = useCallback((...args) => State.eventToWorldPoint(stateRef.current, ...args), [stateRef])
    const shouldIgnoreEvent = useCallback((...args) => State.shouldIgnoreEvent(stateRef.current, ...args), [stateRef])

    return useMemo(() => ({
        ...state,
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
        resetCameraConfig,
        setCameraConfig,
        getCurrentScale,
        getSpring,
        stopSpring,
        defaultCameraConfig,
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
        resetCameraConfig,
        setCameraConfig,
        getCurrentScale,
        getSpring,
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
    const camera = useCameraSimpleApi(props)
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
    const { updateScale, shouldIgnoreEvent } = useCameraContext()

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
        updateScale({
            x,
            y,
            delta,
        })
    }, [elRef, updateScale, shouldIgnoreEvent])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('wheel', onChangeScale)
        return () => {
            el.removeEventListener('wheel', onChangeScale)
        }
    }, [elRef, onChangeScale])
}

function usePanControls(elRef) {
    const { pan, setCameraConfig } = useCameraContext()
    const [isPanning, setPanning] = useState(false)
    const prevPositionRef = useRef({
        lastX: 0,
        lastY: 0,
    })

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
        const lastX = event.clientX - left
        const lastY = event.clientY - top
        setCameraConfig((s) => ({
            ...s,
            immediate: true,
        }))

        prevPositionRef.current = {
            lastX,
            lastY,
        }

        setPanning(true)
    }, [elRef, setCameraConfig, isPanning, setPanning])

    const stopPanning = useCallback(() => {
        if (!isPanning) { return }
        setCameraConfig((s) => ({
            ...s,
            immediate: false,
        }))

        setPanning(false)
    }, [isPanning, setCameraConfig])

    const onPan = useCallback((event) => {
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
        const { lastX, lastY } = prevPositionRef.current
        prevPositionRef.current = {
            lastX: x,
            lastY: y,
        }

        pan({
            x: x - lastX,
            y: y - lastY,
        })
    }, [isPanning, elRef, stopPanning, pan])

    useEffect(() => {
        if (!isPanning) { return }
        window.addEventListener('mousemove', onPan)
        window.addEventListener('mouseup', stopPanning)
        return () => {
            window.removeEventListener('mousemove', onPan)
            window.removeEventListener('mouseup', stopPanning)
        }
    }, [isPanning, onPan, stopPanning])

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
