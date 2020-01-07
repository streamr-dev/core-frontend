// @flow

import React, { useState, useCallback, useMemo, type Node } from 'react'
import cx from 'classnames'
import { DraggableCore } from 'react-draggable'
import { Resizable } from 'react-resizable'
import { useCameraState } from './Camera'

import SvgIcon from '$shared/components/SvgIcon'

import CanvasWindow from './CanvasWindow'
import { type Bounds } from '$editor/shared/utils/bounds'
import { type UseStateTuple } from '$shared/flowtype/common-types'

import styles from './DraggableCanvasWindow.pcss'

type BaseProps = {
    title?: string,
    onClose: Function,
    className?: string,
    children?: Node,
}

export const Title = ({ children, className, onClose, ...props }: BaseProps) => (
    <div {...props} className={cx(className, styles.titleContainer)}>
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
    <div {...props} className={cx(styles.dialog, className)}>
        {!!title && (
            <Title onClose={onClose}>{title}</Title>
        )}
        {children}
    </div>
)

export const Toolbar = ({ children, className, ...props }: BaseProps) => (
    <div {...props} className={cx(styles.toolbar, className)}>
        {children}
    </div>
)

type CanvasWindowProps = Bounds & {
    onChangePosition: Function,
    onChangeSize: Function,
    children?: Node,
}

export function useLayoutState({ x = 0, y = 0, width = 600, height = 400 }: Bounds = {}) {
    const [position, setPosition]: UseStateTuple<[number, number]> = useState([x, y])

    const [size, setSize]: UseStateTuple<[number, number]> = useState([width, height])

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
    const { scale } = useCameraState()
    const { position, setPosition, size, setSize } = useLayoutState({
        x,
        y,
        width,
        height,
    })

    const [dragging, setDragging] = useState(false)
    const [resizing, setResizing] = useState(false)

    const onDragStart = useCallback(() => {
        setPosition([x, y])
        setDragging(true)
    }, [setPosition, setDragging, x, y])

    const onDrag = useCallback((e, coreEvent) => {
        setPosition(([posX, posY]) => ([
            posX + (coreEvent.deltaX / scale),
            posY + (coreEvent.deltaY / scale),
        ]))
    }, [setPosition, scale])

    const onDragStop = useCallback(() => {
        if (!dragging) { return }

        setDragging(false)

        if (onChangePosition) {
            onChangePosition(position)
        }
    }, [dragging, setDragging, position, onChangePosition])

    const onResizeStart = useCallback(() => {
        setSize([
            width,
            height,
        ])
        if (!resizing) {
            setResizing(true)
        }
    }, [width, height, setSize, resizing, setResizing])

    const onResizeStop = useCallback(() => {
        if (!resizing) { return }

        if (onChangeSize) {
            onChangeSize(size)
        }
        setResizing(false)
    }, [resizing, size, setResizing, onChangeSize])

    const onResize = useCallback((e) => {
        setSize(([w, h]) => ([
            w + (e.movementX / scale),
            h + (e.movementY / scale),
        ]))
    }, [setSize, scale])

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
                scale={scale}
            >
                <Resizable
                    className={styles.ResizableBox}
                    width={dim.width}
                    height={dim.height}
                    minConstraints={[200, 200]}
                    onResizeStop={onResizeStop}
                    onResize={onResize}
                    onResizeStart={onResizeStart}
                    draggableOpts={{ scale }}
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
