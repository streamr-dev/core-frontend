// @flow

import React, { useState, useCallback, useMemo, useContext, type Node } from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'
import { Resizable } from 'react-resizable'

import SvgIcon from '$shared/components/SvgIcon'

import CanvasWindow, { CanvasWindowContext } from './CanvasWindow'

import styles from './DraggableCanvasWindow.pcss'

type BaseProps = {
    title?: string,
    onClose: Function,
    className?: string,
    children?: Node,
}

export const Title = ({ children, className, onClose, ...props }: BaseProps) => (
    <div className={cx(className, styles.titleContainer)} {...props}>
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

export const Dialog = ({
    children,
    className,
    onClose,
    title,
    ...props
}: BaseProps) => (
    <div className={cx(styles.dialog, className)} {...props}>
        {!!title && (
            <Title onClose={onClose}>{title}</Title>
        )}
        {children}
    </div>
)

export const Toolbar = ({ children, className, ...props }: BaseProps) => (
    <div className={cx(styles.toolbar, className)} {...props}>
        {children}
    </div>
)

export type Layout = {
    x: number,
    y: number,
    width: number,
    height: number,
}

type CanvasWindowProps = Layout & {
    onChangePosition: Function,
    onChangeSize: Function,
    children?: Node,
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

export function useLayoutState({ x = 0, y = 0, width = 600, height = 400 }: Layout = {}) {
    // wtf flow. I don't know what it wants.
    // $FlowFixMe
    const [position, setPosition] = useState([x, y])
    // $FlowFixMe
    const [size, setSize] = useState([width, height])
    return useMemo(() => ({
        position,
        setPosition,
        size,
        setSize,
    }), [position, setPosition, size, setSize])
}

export const DraggableCanvasWindow = ({
    x,
    y,
    width,
    height,
    onChangePosition,
    onChangeSize,
    children,
}: CanvasWindowProps) => {
    const { position, setPosition, size, setSize } = useLayoutState({
        x,
        y,
        width,
        height,
    })

    // $FlowFixMe
    const [dragging, setDragging] = useState(false)
    // $FlowFixMe
    const [resizing, setResizing] = useState(false)

    const canvasWindowElRef = useContext(CanvasWindowContext)

    const onDragStart = useCallback(() => {
        setPosition([x, y])
        setDragging(true)
    }, [setPosition, setDragging, x, y])

    const onDrag = useCallback((e, coreEvent) => {
        const { current: canvasWindowEl } = canvasWindowElRef
        const rect = canvasWindowEl.getBoundingClientRect()
        // constrain drag to screen
        setPosition(([posX, posY]) => ([
            clamp(posX + coreEvent.deltaX, 0, rect.width - size[0]),
            clamp(posY + coreEvent.deltaY, 0, rect.height - size[1]),
        ]))
    }, [setPosition, size, canvasWindowElRef])

    const onDragStop = useCallback(() => {
        if (!dragging) { return }

        setDragging(false)

        if (onChangePosition) {
            onChangePosition(position)
        }
    }, [dragging, setDragging, position, onChangePosition])

    const onResizeStart = useCallback(() => {
        setSize([width, height])
        setResizing(true)
    }, [width, height, setSize, setResizing])

    const onResizeStop = useCallback(() => {
        if (!resizing) { return }

        setResizing(false)
        if (onChangeSize) {
            onChangeSize(size)
        }
    }, [resizing, size, setResizing, onChangeSize])

    const onResize = useCallback((e, data) => {
        setSize([data.size.width, data.size.height])
    }, [setSize])

    const pos = useMemo(() => ({
        left: dragging ? position[0] : x,
        top: dragging ? position[1] : y,
    }), [dragging, position, x, y])

    const dim = useMemo(() => ({
        width: resizing ? size[0] : width,
        height: resizing ? size[1] : height,
    }), [resizing, size, width, height])

    const style = useMemo(() => ({
        ...pos,
        ...dim,
    }), [pos, dim])

    return (
        <CanvasWindow className={styles.root}>
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
    x: 0,
    y: 0,
    width: 600,
    height: 400,
}

DraggableCanvasWindow.Title = Title
DraggableCanvasWindow.Dialog = Dialog
DraggableCanvasWindow.Toolbar = Toolbar

export default DraggableCanvasWindow
