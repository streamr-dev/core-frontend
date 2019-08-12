import React, { useRef, useState, useCallback, useEffect } from 'react'
import cx from 'classnames'
import styles from './Camera.pcss'

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

export default function Camera({ className, children }) {
    const elRef = useRef()
    const [{
        x,
        y,
        zoom,
        xImage,
        yImage,
    }, setZoom] = useState({
        zoom: 1,
        x: 0,
        y: 0,
        xLast: 0,
        yLast: 0,
        xImage: 0,
        yImage: 0,
    })

    const onWheel = useCallback((event) => {
        const el = elRef.current
        event.preventDefault()

        const { left, top } = el.getBoundingClientRect()
        const { deltaY } = event
        // find current location on screen
        const xScreen = Math.round(event.clientX - left)
        const yScreen = Math.round(event.clientY - top)

        setZoom(({
            zoom,
            xImage,
            yImage,
            xLast,
            yLast,
        }) => {
            // find current location on the image at the current scale
            xImage += Math.round((xScreen - xLast) / zoom)
            yImage += Math.round((yScreen - yLast) / zoom)

            // determine the new scale
            if (deltaY < 0) {
                zoom *= 1.05
            } else {
                zoom *= 0.95
            }
            zoom = Math.round(clamp(zoom, 0.1, 3) * 100) / 100

            // determine the location on the screen at the new scale
            const xNew = Math.round((xScreen - xImage) / zoom)
            const yNew = Math.round((yScreen - yImage) / zoom)

            // save the current screen location
            xLast = xScreen
            yLast = yScreen

            return {
                zoom,
                xImage,
                yImage,
                x: xNew,
                y: yNew,
                xLast,
                yLast,
            }
        })
    }, [setZoom])

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
                className={styles.zoomLayer}
                style={{
                    transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
                    transformOrigin: `${xImage}px ${yImage}px`,
                }}
            >
                {children}
            </div>
        </div>
    )
}
