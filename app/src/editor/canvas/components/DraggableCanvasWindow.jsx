// @flow

import React, { useState, useCallback, useMemo, type Node } from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'
import { Resizable } from 'react-resizable'

import SvgIcon from '$shared/components/SvgIcon'

import CanvasWindow from './CanvasWindow'

import styles from './DraggableCanvasWindow.pcss'

type BaseProps = {
    title?: string,
    onClose: Function,
    className?: string,
    children?: Node,
}

export const Title = ({ children, onClose }: BaseProps) => (
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

export const Dialog = ({ children, className, onClose, title }: BaseProps) => (
    <div className={cx(styles.dialog, className)}>
        {!!title && (
            <Title onClose={onClose}>{title}</Title>
        )}
        {children}
    </div>
)

export const Toolbar = ({ children, className }: BaseProps) => (
    <div className={cx(styles.toolbar, className)}>
        {children}
    </div>
)

export type Layout = {
    dragging: boolean,
    resizing: boolean,
    x: number,
    y: number,
    width: number,
    height: number,
}

export const useLayoutState = (initialState: Layout = {}) => {
    const [layout, setLayout] = useState({
        dragging: false,
        resizing: false,
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        ...initialState,
    })
    const updatePosition = useCallback((x: number, y: number) => {
        setLayout((state) => ({
            ...state,
            x,
            y,
        }))
    }, [setLayout])
    const updateSize = useCallback((width: number, height: number) => {
        setLayout((state) => ({
            ...state,
            width,
            height,
        }))
    }, [setLayout])
    const setDragging = useCallback((dragging: boolean = true) => {
        setLayout((state) => ({
            ...state,
            dragging,
        }))
    }, [setLayout])
    const setResizing = useCallback((resizing: boolean = true) => {
        setLayout((state) => ({
            ...state,
            resizing,
        }))
    }, [setLayout])
    return useMemo(() => (
        [layout, updateSize, updatePosition, setDragging, setResizing]
    ), [layout, updateSize, updatePosition, setDragging, setResizing])
}

type CanvasWindowProps = {
    position: {
        x: number,
        y: number,
    },
    size: {
        width: number,
        height: number,
    },
    onPositionUpdate: Function,
    onSizeUpdate: Function,
    children?: Node,
}

export const DraggableCanvasWindow = ({
    position,
    size,
    onPositionUpdate,
    onSizeUpdate,
    children,
}: CanvasWindowProps) => {
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
