// @flow

import React, { type Context, createContext, type Node, useState, useRef, useCallback, useContext, useMemo, useEffect } from 'react'
import cx from 'classnames'
import { type Ref } from '$shared/flowtype/common-types'
import Handle from './Handle'
import SizeConstraintProvider, { Context as SizeConstraintContext } from './SizeConstraintProvider'
import styles from './resizable.pcss'

type Size = {
    height: number,
    width: number,
}

type ContextProps = {
    enabled: boolean,
    height: number,
    setShowHandle: (?boolean) => void,
    width: number,
}

const defaultContext: ContextProps = {
    enabled: false,
    height: 0,
    setShowHandle: () => {},
    width: 0,
}

const ResizeableContext = (createContext(defaultContext): Context<ContextProps>)

type Props = {
    children?: Node,
    className?: ?string,
    enabled?: boolean,
    height: number,
    onResize?: ?(Size) => void,
    style?: any,
    width: number,
    scale: number,
}

const Resizable = React.memo(({
    children,
    className,
    enabled = false,
    height,
    onResize,
    style,
    width,
    scale = 1,
    ...props
}: Props) => {
    const { minWidth, minHeight } = useContext(SizeConstraintContext)

    const [showHandle, setShowHandle] = useState(true)

    const [size, setSize] = useState({
        height,
        width,
    })

    const [isResizing, setIsResizing] = useState(false)

    const previousSize: Ref<Size> = useRef(null)

    const updateSize = useCallback(({ dx, dy }): Size => {
        const { height, width } = ((previousSize.current: any): Size)
        dx /= scale
        dy /= scale
        const size = {
            height: Math.max(minHeight, height - dy),
            width: Math.max(minWidth, width - dx),
        }
        setSize(size)
        return size
    }, [minHeight, minWidth, scale])

    const ref: Ref<HTMLDivElement> = useRef(null)

    const prepare = useCallback(() => {
        setIsResizing(true)
        const { current: root } = ref

        if (root) {
            const { width, height } = root.getBoundingClientRect()
            previousSize.current = {
                height: height / scale,
                width: width / scale,
            }
            updateSize({
                dx: 0,
                dy: 0,
            })
        }
    }, [updateSize, scale])

    const preview = useCallback((diff) => {
        updateSize(diff)
    }, [updateSize])

    const commit = useCallback((diff) => {
        setIsResizing(false)
        const size: Size = updateSize(diff)

        const { height: prevHeight, width: prevWidth } = ((previousSize.current: any): Size)

        if (size.height !== prevHeight || size.width !== prevWidth) {
            if (onResize) {
                onResize(size)
            }
        } else {
            // No changes? Revert to the size from props.
            setSize({
                width,
                height,
            })
        }
    }, [updateSize, onResize, width, height])

    const value = useMemo(() => ({
        ...size,
        enabled: true,
        setShowHandle,
    }), [size])

    useEffect(() => {
        setSize({
            height,
            width,
        })
    }, [width, height])

    const updatePreviousSize = useCallback(() => {
        previousSize.current = {
            height,
            width,
        }
    }, [width, height])

    const updatePreviousSizeRef: Ref<Function> = useRef()
    updatePreviousSizeRef.current = updatePreviousSize

    const commitRef: Ref<Function> = useRef()
    commitRef.current = commit

    useEffect(() => {
        // We're using refs because we only want this effect to run when either
        // minWidth or minHeight change.

        const commit: (any) => void = (commitRef.current: any)
        const updatePreviousSize: () => void = (updatePreviousSizeRef.current: any)

        updatePreviousSize()
        commit({
            dx: 0,
            dy: 0,
        })
    }, [minWidth, minHeight])

    const divStyle = useMemo(() => ({
        ...style,
        ...(isResizing ? {
            height: size.height,
            width: size.width,
        } : {
            minHeight: size.height,
            minWidth: size.width,
        }),
    }), [style, isResizing, size.width, size.height])

    return enabled ? (
        <ResizeableContext.Provider value={value}>
            <div
                {...props}
                className={cx(styles.root, className)}
                ref={ref}
                style={divStyle}
            >
                {children}
                {!!showHandle && (
                    <Handle
                        beforeDrag={prepare}
                        onDrag={preview}
                        onDrop={commit}
                    />
                )}
            </div>
        </ResizeableContext.Provider>
    ) : (
        <div
            {...props}
            className={cx(styles.root, className)}
            style={style}
        >
            {children}
        </div>
    )
})

export { ResizeableContext as Context }

// $FlowFixMe
export default React.memo(({ onSizeChange, ...props }: Props) => (
    <SizeConstraintProvider onSizeChange={onSizeChange}>
        <Resizable {...props} />
    </SizeConstraintProvider>
))
