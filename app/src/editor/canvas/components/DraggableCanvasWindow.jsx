import React, { useState, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'

import SvgIcon from '$shared/components/SvgIcon'
import CanvasWindow from './CanvasWindow'

import styles from './DraggableCanvasWindow.pcss'

export const Title = ({ children, onClose }) => (
    <div className={styles.titleContainer}>
        <div className={styles.title}>{children}</div>
        <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
        >
            <SvgIcon name="crossHeavy" />
        </button>
    </div>
)

export const Dialog = ({ children, className, onClose, title }) => (
    <div className={cx(styles.dialog, className)}>
        {!!title && (
            <Title onClose={onClose}>{title}</Title>
        )}
        {children}
    </div>
)

export const Toolbar = ({ children, className }) => (
    <div className={cx(styles.toolbar, className)}>
        {children}
    </div>
)

export const DraggableCanvasWindow = (props) => {
    const [layout, setLayoutState] = useState({
        dragging: false,
        // Current transform x and y.
        clientX: props.start.x,
        clientY: props.start.y,
    })

    const onDragStart = useCallback(() => {
        setLayoutState((layout) => ({
            ...layout,
            dragging: true,
        }))
    }, [setLayoutState])

    const onDrag = useCallback((e, coreEvent) => {
        setLayoutState((layout) => {
            if (!layout.dragging) { return layout }

            return {
                ...layout,
                clientX: layout.clientX + coreEvent.deltaX,
                clientY: layout.clientY + coreEvent.deltaY,
            }
        })
    }, [setLayoutState])

    const onPositionUpdateProp = props.onPositionUpdate
    const onDragStop = useCallback(() => {
        setLayoutState((layout) => {
            if (!layout.dragging) { return layout }

            if (onPositionUpdateProp) {
                onPositionUpdateProp(layout.clientX, layout.clientY)
            }

            return {
                ...layout,
                dragging: false,
            }
        })
    }, [setLayoutState, onPositionUpdateProp])

    const style = useMemo(() => ({
        left: layout.clientX,
        top: layout.clientY,
    }), [layout])

    return (
        <CanvasWindow>
            <DraggableCore
                handle={`.${styles.titleContainer}`}
                onStart={onDragStart}
                onDrag={onDrag}
                onStop={onDragStop}
            >
                {React.cloneElement(React.Children.only(props.children), {
                    style,
                })}
            </DraggableCore>
        </CanvasWindow>
    )
}

DraggableCanvasWindow.Title = Title
DraggableCanvasWindow.Dialog = Dialog
DraggableCanvasWindow.Toolbar = Toolbar

export default DraggableCanvasWindow
