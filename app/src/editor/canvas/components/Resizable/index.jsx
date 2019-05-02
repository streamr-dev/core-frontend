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
    width: number,
}

const defaultContext: ContextProps = {
    enabled: false,
    height: 0,
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
}

const Resizable = ({
    children,
    className,
    enabled,
    height,
    onResize,
    style,
    width,
    ...props
}: Props) => {
    const { minWidth, minHeight } = useContext(SizeConstraintContext)

    const [size, setSize] = useState({
        height,
        width,
    })

    const [isResizing, setIsResizing] = useState(false)

    const previousSize: Ref<Size> = useRef(null)

    const updateSize = useCallback(({ dx, dy }): Size => {
        const { height, width } = ((previousSize.current: any): Size)
        const size = {
            height: Math.max(minHeight, height - dy),
            width: Math.max(minWidth, width - dx),
        }
        setSize(size)
        return size
    }, [minHeight, minWidth])

    const ref: Ref<HTMLDivElement> = useRef(null)

    const prepare = useCallback(() => {
        setIsResizing(true)
        const { current: root } = ref

        if (root) {
            const { width, height } = root.getBoundingClientRect()
            previousSize.current = {
                height,
                width,
            }
            updateSize({
                dx: 0,
                dy: 0,
            })
        }
    }, [updateSize])

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
    }), [size])

    useEffect(() => {
        setSize({
            height,
            width,
        })
    }, [width, height])

    return enabled ? (
        <ResizeableContext.Provider value={value}>
            <div
                {...props}
                className={cx(styles.root, className)}
                ref={ref}
                style={{
                    ...style,
                    ...(isResizing ? {
                        height: size.height,
                        width: size.width,
                    } : {
                        minHeight: size.height,
                        minWidth: size.width,
                    }),
                }}
            >
                {children}
                <Handle
                    beforeDrag={prepare}
                    onDrag={preview}
                    onDrop={commit}
                />
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
}

Resizable.defaultProps = {
    enabled: false,
}

export { ResizeableContext as Context }

export default (props: Props) => (
    <SizeConstraintProvider>
        <Resizable {...props} />
    </SizeConstraintProvider>
)
