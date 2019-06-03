import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'
import { Resizable } from 'react-resizable'

import SvgIcon from '$shared/components/SvgIcon'
import useLayoutState from '$editor/shared/hooks/useLayoutState'

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

export const DraggableCanvasWindow = ({
    position,
    size,
    onPositionUpdate,
    onSizeUpdate,
    children,
}) => {
    const [layout, updateSize, updatePosition, setDragging, setResizing] = useLayoutState()

    const onDragStart = useCallback(() => {
        updatePosition(position.x, position.y)
        setDragging()
    }, [updatePosition, setDragging, position])

    const onDrag = useCallback((e, coreEvent) => {
        updatePosition(layout.x + coreEvent.deltaX, layout.y + coreEvent.deltaY)
    }, [layout, updatePosition])

    const onDragStop = useCallback(() => {
        if (!layout.dragging) { return }

        setDragging(false)

        if (onPositionUpdate) {
            onPositionUpdate(layout.x, layout.y)
        }
    }, [layout, setDragging, onPositionUpdate])

    const pos = useMemo(() => ({
        left: layout.dragging ? layout.x : position.x,
        top: layout.dragging ? layout.y : position.y,
    }), [layout, position])
    const dim = useMemo(() => ({
        width: layout.resizing ? layout.width : size.width,
        height: layout.resizing ? layout.height : size.height,
    }), [layout, size])

    const style = useMemo(() => ({
        ...pos,
        ...dim,
    }), [pos, dim])

    const onResizeStart = useCallback(() => {
        updateSize(size.width, size.height)
        setResizing()
    }, [size, updateSize, setResizing])

    const onResize = useCallback((e, data) => {
        updateSize(data.size.width, data.size.height)
    }, [updateSize])

    const onResizeStop = useCallback(() => {
        if (!layout.resizing) { return }

        setResizing(false)

        if (onSizeUpdate) {
            onSizeUpdate(layout.width, layout.height)
        }
    }, [layout, setResizing, onSizeUpdate])

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
                    width={dim.width}
                    height={dim.height}
                    minConstraints={[200, 200]}
                    onResizeStop={onResizeStop}
                    onResize={onResize}
                    onResizeStart={onResizeStart}
                >
                    {React.cloneElement(React.Children.only(children), {
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
