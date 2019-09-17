import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import cx from 'classnames'
import styles from './Camera.pcss'

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

function useCameraApi(scaleFactor = 0.1) {
    const [state, setState] = useState({
        scale: 1,
        x: 0,
        y: 0,
    })
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

export const CameraContext = React.createContext({})

export function useCameraContext() {
    return useContext(CameraContext)
}

function CameraProvider({ onChange, children }) {
    const camera = useCameraApi()
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
        event.preventDefault()
        const el = elRef.current
        const { deltaY: delta } = event
        if (delta === 0) { return }
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = Math.round(event.clientX - left)
        const y = Math.round(event.clientY - top)
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
        const x = Math.round(event.clientX - left)
        const y = Math.round(event.clientY - top)
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
        const x = Math.round(event.clientX - left)
        const y = Math.round(event.clientY - top)
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

function CameraContainer({ className, children }) {
    const { x, y, scale } = useCameraContext()

    const elRef = useRef()

    useWheelControls(elRef)
    usePanControls(elRef)

    return (
        <div className={cx(className, styles.root)} ref={elRef}>
            <div
                className={styles.scaleLayer}
                style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale}) `,
                    transformOrigin: '0 0',
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default function Camera({ onChange, ...props }) {
    return (
        <CameraProvider onChange={onChange}>
            <CameraContainer {...props} />
        </CameraProvider>
    )
}

