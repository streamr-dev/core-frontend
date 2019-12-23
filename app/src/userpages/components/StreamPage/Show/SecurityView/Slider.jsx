import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { useThrottled } from '$shared/hooks/wrapCallback'

import styles from './Slider.pcss'

// subtract a bounding rect from another bounding rect
const subtract = (a, b) => ({
    // can't spread because DOM rect width/height aren't enumerable
    width: a.width,
    height: a.height,
    left: a.left - b.left,
    top: a.top - b.top,
})

/**
 * Finds positions of selector elements (e.g. radio inputs) in its container
 * and renders a track + stops between them.
 *
 * Why reading positions from DOM? The center points of the options we're drawing graphics
 * between is dependent on the width of the label text, which we can't know without rendering.
 * Without this, the rendered points wouldn't line up with the text or the text wouldn't align with edges of container.
 * Simple to just let CSS do its thing and piggypack on top of the layout it produces.
 */

export default function Slider({ index: selectedIndex = 0, selector } = {}) {
    const elRef = useRef()
    const [positions, setPositions] = useState()

    const updateLayout = useCallback(() => {
        if (!elRef.current) { return }
        const target = elRef.current.parentElement
        const inputs = Array.from(target.querySelectorAll(selector))
        const parent = target.getBoundingClientRect()

        setPositions(() => {
            const rects = inputs.map((input) => input.getBoundingClientRect())
            const positions = rects.map((rect) => subtract(rect, parent))
            const first = positions[0]
            const last = positions[positions.length - 1]
            const left = first.left + (first.width * 0.5)
            const top = first.top + (first.height * 0.5)
            const width = (last.left + (last.width * 0.5)) - left

            return {
                positions,
                top,
                left,
                width,
            }
        })
    }, [selector])

    const onResize = useThrottled(updateLayout, 250)

    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [onResize])

    useLayoutEffect(() => {
        updateLayout()
    }, [updateLayout])

    if (!positions) {
        return <div className={styles.SecuritySlider} ref={elRef} />
    }

    const selectedPosition = positions.positions[selectedIndex]

    return (
        <div className={styles.SecuritySlider} ref={elRef}>
            <div
                className={styles.SliderTrack}
                style={{
                    left: positions.left,
                    width: positions.width,
                }}
            >
                {positions.positions.map((p, index) => (
                    <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={cx(styles.SliderStop, {
                            [styles.highlighted]: index <= selectedIndex,
                            [styles.selected]: index === selectedIndex,
                        })}
                        style={{
                            top: (p.top + (p.height * 0.5)) - positions.top,
                            left: (p.left + (p.width * 0.5)) - positions.left,
                        }}
                    />
                ))}
            </div>
            <div
                className={cx(styles.SliderTrack, styles.SliderProgress)}
                style={{
                    left: positions.left,
                    width: (selectedPosition.left + (selectedPosition.width * 0.5)) - positions.left,
                    top: (selectedPosition.top + (selectedPosition.height * 0.5)) - positions.top,
                }}
            >
                <div className={styles.SliderThumb}>
                    <div className={cx(styles.SliderStop, styles.highlighted)} />
                </div>
            </div>
        </div>
    )
}
