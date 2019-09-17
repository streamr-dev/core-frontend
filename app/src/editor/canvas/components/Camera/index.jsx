import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import cx from 'classnames'
import styles from './Camera.pcss'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

export function updateScaleState(s, { x, y, scaleFactor }) {
    // find position at the current scale
    const { scale: currentScale } = s

    // update scale
    const newScale = clamp(currentScale * scaleFactor, 0.1, 3)

    // find same position at new scale
    const ratio = (1 - (newScale / currentScale))

    // adjust for offset created by scale change
    const x2 = s.x + ((x - s.x) * ratio)
    const y2 = s.y + ((y - s.y) * ratio)

    return {
        ...s,
        scale: newScale,
        x: x2,
        y: y2,
    }
}

function useCameraApi() {
    const [state, setState] = useState({
        scale: 1,
        x: 0,
        y: 0,
    })

    const updateScale = useCallback(({ x, y, delta }) => {
        setState((s) => {
            let scaleFactor = 1
            if (delta < 0) {
                scaleFactor = 1.1
            } else {
                scaleFactor = 0.9
            }
            return updateScaleState(s, {
                x,
                y,
                scaleFactor,
            })
        })
    }, [setState])

    const initUpdatePosition = useCallback(({ x, y }) => {
        setState((s) => ({
            ...s,
            lastX: x,
            lastY: y,
        }))
    }, [setState])
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
    const onWheel = useCallback((event) => {
        const el = elRef.current
        event.preventDefault()
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
        el.addEventListener('wheel', onWheel)
        return () => {
            el.removeEventListener('wheel', onWheel)
        }
    }, [elRef, onWheel])
}

function usePanControls(elRef) {
    const { initUpdatePosition, updatePosition } = useCameraContext()
    const [isPanning, setPanning] = useState(false)

    const onMouseDown = useCallback((event) => {
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

    const onMouseUp = useCallback(() => {
        if (!isPanning) { return }
        setPanning(false)
    }, [isPanning])

    const onMouseMove = useCallback((event) => {
        if (!isPanning) { return }
        const el = elRef.current
        const { left, top } = el.getBoundingClientRect()
        // find current location on screen
        const x = Math.round(event.clientX - left)
        const y = Math.round(event.clientY - top)
        updatePosition({
            x,
            y,
        })
    }, [isPanning, elRef, updatePosition])

    useEffect(() => {
        if (!isPanning) { return }
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [isPanning, onMouseMove, onMouseUp])

    useEffect(() => {
        const el = elRef.current
        el.addEventListener('mousedown', onMouseDown)
        return () => {
            el.removeEventListener('mousedown', onMouseDown)
        }
    }, [elRef, onMouseDown])
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

