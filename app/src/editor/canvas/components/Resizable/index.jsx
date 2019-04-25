// @flow

import React, { type Context, createContext, type Node, useState, useRef, useCallback, useEffect, useContext } from 'react'
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
    height: number,
    width: number,
}

const defaultContext: ContextProps = {
    height: 0,
    width: 0,
}

const ResizeableContext = (createContext(defaultContext): Context<ContextProps>)

type Props = {
    children?: Node,
    className?: ?string,
    height: number,
    onResize?: ?(Size) => void,
    style?: any,
    width: number,
}

const Resizable = ({
    children,
    className,
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

    const tempSize: Ref<Size> = useRef({
        height,
        width,
    })

    const updateSize = useCallback(({ dx, dy }) => {
        const { height, width } = ((tempSize.current: any): Size)
        setSize({
            height: Math.max(minHeight, height - dy),
            width: Math.max(minWidth, width - dx),
        })
    }, [minHeight, minWidth])

    const preview = useCallback((diff) => {
        setIsResizing(true)
        updateSize(diff)
    }, [updateSize])

    const commit = useCallback((diff) => {
        setIsResizing(false)
        updateSize(diff)
    }, [updateSize])

    useEffect(() => {
        tempSize.current = {
            height,
            width,
        }
        setSize(tempSize.current)
    }, [width, height])

    useEffect(() => {
        const { height, width } = ((tempSize.current: any): Size)
        if (!isResizing && onResize && (size.height !== height || size.width !== width)) {
            onResize(size)
        }
    }, [isResizing, onResize, size])

    return (
        <ResizeableContext.Provider value={size}>
            <div
                {...props}
                className={cx(styles.root, className)}
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
                <Handle onDrag={preview} onDrop={commit} />
            </div>
        </ResizeableContext.Provider>
    )
}

export { ResizeableContext as Context }

export default (props: any) => (
    <SizeConstraintProvider>
        <Resizable {...props} />
    </SizeConstraintProvider>
)
