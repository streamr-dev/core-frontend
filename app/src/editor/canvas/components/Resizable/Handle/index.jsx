// @flow

import React, { useState, Fragment, useCallback, useEffect, useRef, type ComponentType } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import BodyClass from '$shared/components/BodyClass'
import styles from './handle.pcss'

type Coords = {
    x: number,
    y: number,
}

type Delta = {
    dx: number,
    dy: number,
}

type Props = {
    beforeDrag?: ?() => void,
    onDrop?: ?(Delta) => void,
    onDrag?: ?(Delta) => void,
}

const Handle = ({ beforeDrag, onDrop, onDrag }: Props) => {
    const [isDragged, setIsDragged] = useState(false)

    const initialCoords: Ref<Coords> = useRef({
        x: 0,
        y: 0,
    })

    const currentDelta = useCallback((clientX, clientY) => {
        const coords: Coords = initialCoords.current || {
            x: 0,
            y: 0,
        }

        return {
            dx: coords.x - (clientX || 0),
            dy: coords.y - (clientY || 0),
        }
    }, [])

    const onMouseUp = useCallback((e: SyntheticMouseEvent<EventTarget>) => {
        e.stopPropagation()
        setIsDragged(false)

        if (onDrop) {
            onDrop(currentDelta(e.clientX, e.clientY))
        }
    }, [onDrop, currentDelta])

    const onKeyDown = useCallback((e: SyntheticKeyboardEvent<EventTarget>) => {
        if (e.key === 'Escape') {
            e.stopPropagation()
            setIsDragged(false)

            if (onDrop) {
                onDrop({
                    dx: 0,
                    dy: 0,
                })
            }
        }
    }, [onDrop])

    const onMouseDown = useCallback((e: SyntheticMouseEvent<EventTarget>) => {
        e.stopPropagation()
        initialCoords.current = {
            x: e.clientX,
            y: e.clientY,
        }
        setIsDragged(true)

        if (beforeDrag) {
            beforeDrag()
        }
    }, [beforeDrag])

    const onMouseMove = useCallback(({ clientX, clientY }: SyntheticMouseEvent<EventTarget>) => {
        if (onDrag) {
            onDrag(currentDelta(clientX, clientY))
        }
    }, [onDrag, currentDelta])

    useEffect(() => {
        if (isDragged) {
            window.addEventListener('mouseup', onMouseUp)
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('keydown', onKeyDown)
        }

        return () => {
            if (isDragged) {
                window.removeEventListener('mouseup', onMouseUp)
                window.removeEventListener('mousemove', onMouseMove)
                window.removeEventListener('keydown', onKeyDown)
            }
        }
    }, [isDragged, onMouseUp, onMouseMove, onKeyDown])

    return (
        <Fragment>
            {!!isDragged && (
                <BodyClass className={styles.resizing} />
            )}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                onMouseDown={onMouseDown}
                className={styles.root}
            />
        </Fragment>
    )
}

export default (React.memo(Handle): ComponentType<Props>)
