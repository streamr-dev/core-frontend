import React, { useState, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'
import { Resizable } from 'react-resizable'

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
        resizing: false,
        // Current transform x and y.
        clientX: props.position.x,
        clientY: props.position.y,
        width: props.size.width,
        height: props.size.height,
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
        if (!layout.dragging) { return }

        setLayoutState({
            ...layout,
            dragging: false,
        })

        if (onPositionUpdateProp) {
            onPositionUpdateProp(layout.clientX, layout.clientY)
        }
    }, [layout, setLayoutState, onPositionUpdateProp])

    const style = useMemo(() => ({
        left: layout.clientX,
        top: layout.clientY,
        width: layout.width,
        height: layout.height,
    }), [layout])

    const { width, height } = layout

    const onResizeStart = useCallback(() => {
        setLayoutState((layout) => ({
            ...layout,
            resizing: true,
        }))
    }, [setLayoutState])

    const onResize = useCallback((e, data) => {
        setLayoutState((layout) => ({
            ...layout,
            height: data.size.height,
            width: data.size.width,
        }))
    }, [setLayoutState])

    const onSizeUpdateProp = props.onSizeUpdate
    const onResizeStop = useCallback(() => {
        if (!layout.resizing) { return }

        setLayoutState({
            ...layout,
            resizing: false,
        })

        if (onSizeUpdateProp) {
            onSizeUpdateProp(layout.width, layout.height)
        }
    }, [layout, setLayoutState, onSizeUpdateProp])

    return (
        <CanvasWindow>
            <DraggableCore
                handle={`.${styles.titleContainer}`}
                onStart={onDragStart}
                onDrag={onDrag}
                onStop={onDragStop}
            >
                <Resizable
                    className={styles.ResizableBox}
                    width={width}
                    height={height}
                    minConstraints={[200, 100]}
                    onResizeStop={onResizeStop}
                    onResize={onResize}
                    onResizeStart={onResizeStart}
                >
                    {React.cloneElement(React.Children.only(props.children), {
                        style,
                    })}
                </Resizable>
            </DraggableCore>
        </CanvasWindow>
    )
}

DraggableCanvasWindow.defaultProps = {
    position: {
        x: 0,
        y: 0,
    },
    size: {
        width: 600,
        height: 400,
    },
}

DraggableCanvasWindow.Title = Title
DraggableCanvasWindow.Dialog = Dialog
DraggableCanvasWindow.Toolbar = Toolbar

export default DraggableCanvasWindow
