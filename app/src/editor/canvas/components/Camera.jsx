import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import cx from 'classnames'
import styles from './Camera.pcss'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

function useCameraApi() {
    const [{
        x,
        y,
        scale,
        xCenter,
        yCenter,
    }, setScale] = useState({
        scale: 1,
        x: 0,
        y: 0,
        xLast: 0,
        yLast: 0,
        xCenter: 0,
        yCenter: 0,
    })

    const updateScale = useCallback(({ x, y, delta }) => {
        setScale(({
            scale,
            xCenter,
            yCenter,
            xLast,
            yLast,
        }) => {
            // find current location on the image at the current scale
            xCenter += Math.round((x - xLast) / scale)
            yCenter += Math.round((y - yLast) / scale)

            // save the current screen location
            xLast = x
            yLast = y

            // determine the new scale
            if (delta < 0) {
                scale *= 1.05
            } else {
                scale *= 0.95
            }
            scale = Math.round(clamp(scale, 0.1, 3) * 100) / 100

            // determine the location on the screen at the new scale
            const xNew = Math.round((x - xCenter) / scale)
            const yNew = Math.round((y - yCenter) / scale)

            return {
                scale,
                xCenter,
                yCenter,
                x: xNew,
                y: yNew,
                xLast,
                yLast,
            }
        })
    }, [setScale])

    return useMemo(() => ({
        x,
        y,
        xCenter,
        yCenter,
        scale,
        updateScale,
    }), [x, y, xCenter, yCenter, scale, updateScale])
}

export const CameraContext = React.createContext({})

export function useCameraContext() {
    return useContext(CameraContext)
}

function CameraProvider({ children }) {
    return (
        <CameraContext.Provider value={useCameraApi()}>
            {children}
        </CameraContext.Provider>
    )
}

function CameraContainer({ className, children }) {
    const {
        x,
        y,
        scale,
        xCenter,
        yCenter,
        updateScale,
    } = useCameraContext()

    const elRef = useRef()
    const onWheel = useCallback((event) => {
        const el = elRef.current
        event.preventDefault()
        const { left, top } = el.getBoundingClientRect()
        const { deltaY: delta } = event
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

    return (
        <div
            ref={elRef}
            className={cx(className, styles.root)}
        >
            <div
                className={styles.scaleLayer}
                style={{
                    transform: `scale(${scale}) translate(${x}px, ${y}px)`,
                    transformOrigin: `${xCenter}px ${yCenter}px`,
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default function Camera({ className, children }) {
    return (
        <CameraProvider>
            <CameraContainer className={className}>
                {children}
            </CameraContainer>
        </CameraProvider>
    )
}

