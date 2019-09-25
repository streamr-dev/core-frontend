import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { useSpring, animated, interpolate } from 'react-spring'
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

function fitCamera({
    x,
    y,
    width,
    height,
    fitWidth,
    fitHeight,
    padding = 20,
} = {}) {
    const totalPadding = 2 * padding
    const maxWidth = fitWidth - totalPadding
    const maxHeight = fitHeight - totalPadding
    const scale = Math.min(maxWidth / width, maxHeight / height)
    // vertically & horizontally center content
    const offsetY = (fitHeight - (height * scale)) / 2
    const offsetX = (fitWidth - (width * scale)) / 2
    if (!scale) {
        return defaultFit
    }

    return {
        x: -(x * scale) + offsetX,
        y: -(y * scale) + offsetY,
        scale,
    }
}

function updateScaleState(s, { x, y, scaleFactor }) {
    const { scale: currentScale } = s
    const newScale = clamp(currentScale * scaleFactor, 0.1, 3)

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

function useCameraSimpleApi(scaleFactor = 0.1) {
    const [state, setActualState] = useState({
        scale: 1,
        x: 0,
        y: 0,
    })

    // clamps scale
    const setState = useCallback((v) => {
        setActualState((state) => {
            const nextState = (typeof v === 'function') ? v(state) : v
            return {
                ...nextState,
                scale: clamp(nextState.scale, 0.1, 3),
            }
        })
    }, [setActualState])

    // updates scale of camera, centers scaling on x,y
    const updateScale = useCallback(({ x, y, delta }) => {
        setState((s) => {
            const factor = Math.abs(scaleFactor * (delta / 120))
            const actualScaleFactor = delta < 0 ? 1 + factor : 1 - factor
            return updateScaleState(s, {
                x,
                y,
                scaleFactor: actualScaleFactor,
            })
        })
    }, [setState, scaleFactor])

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

    return useMemo(() => ({
        ...state,
        updateScale,
        initUpdatePosition,
        updatePosition,
        setState,
    }), [state, setState, updateScale, updatePosition, initUpdatePosition])
}

const cameraConfig = {
    mass: 1,
    friction: 14,
    precision: 0.00001,
    clamp: true,
}

function useCameraSpringApi() {
    const camera = useCameraSimpleApi()
    const { x, y, scale } = camera
    const onSpring = useCallback(() => ({
        x,
        y,
        scale,
        config: cameraConfig,
    }), [x, y, scale])
    const [spring, set] = useSpring(onSpring)

    set({
        x,
        y,
        scale,
    })

    const springRef = useRef()
    springRef.current = spring

    const getSpring = useCallback(() => (
        springRef.current
    ), [springRef])

    return useMemo(() => ({
        getSpring,
        ...camera,
    }), [getSpring, camera])
}

export const CameraContext = React.createContext({})

export function useCameraContext() {
    return useContext(CameraContext)
}

export function CameraProvider({ bounds, onChange, children, ...props }) {
    const camera = useCameraSpringApi(props)
    useEffect(() => {
        if (typeof onChange !== 'function') { return }
        onChange(camera)
    }, [onChange, camera])
    const { setState } = camera
    const [hasInitBounds, setHasInitBounds] = useState(false)

    useEffect(() => {
        if (hasInitBounds || !bounds) { return }
        setHasInitBounds(true)
        setState(fitCamera(bounds))
    }, [setState, bounds, hasInitBounds, setHasInitBounds])

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
    const { initUpdatePosition, updatePosition } = useCameraContext()
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

function useCameraSpring() {
    const camera = useCameraContext()
    return camera.getSpring()
}

export default function Camera({ className, children }) {
    const elRef = useRef()

    useWheelControls(elRef)
    usePanControls(elRef)

    const spring = useCameraSpring()

    return (
        <div className={cx(className, styles.root)} ref={elRef}>
            <animated.div
                className={styles.scaleLayer}
                style={{
                    transform: interpolate([spring.x, spring.y, spring.scale], (x, y, scale) => (
                        `translate(${x}px, ${y}px) scale(${scale})`
                    )),
                }}
            >
                {children}
            </animated.div>
        </div>
    )
}
