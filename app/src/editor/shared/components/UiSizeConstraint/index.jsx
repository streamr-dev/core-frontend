// @flow

import React, { type Node, useContext, createContext, useMemo, type Context } from 'react'
import cx from 'classnames'
import { Context as ResizableContext } from '$editor/canvas/components/Resizable'
import { Context as SizeConstraintContext } from '$editor/canvas/components/Resizable/SizeConstraintProvider'
import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
import styles from './uiSizeConstraint.pcss'

type ContextProps = {
    height: number,
    width: number,
}

const defaultContext: ContextProps = {
    height: -1,
    width: -1,
}

const UiSizeContext = (createContext(defaultContext): Context<ContextProps>)

export { UiSizeContext as Context }

type Props = {
    children?: Node,
    className?: ?string,
    minHeight: number,
    minWidth: number,
}

const UiSizeConstraint = ({ children, className, minWidth: minWidthProp, minHeight: minHeightProp }: Props) => {
    const { height, width, enabled } = useContext(ResizableContext)

    const { minHeight } = useContext(SizeConstraintContext)

    const value = useMemo(() => ({
        height: Math.max((height - minHeight), 0) + minHeightProp,
        width,
    }), [height, minHeight, minHeightProp, width])

    return (
        <UiSizeContext.Provider value={value}>
            <div
                className={cx(styles.root, className)}
                style={enabled ? {
                    height: value.height,
                    minHeight: minHeightProp,
                    minWidth: minWidthProp,
                    width: value.width,
                } : {}}
            >
                <Probe group="ModuleHeight" uid="UI" height={minHeightProp} />
                <Probe group="UiWidth" uid="UI" width={minWidthProp} />
                {children}
            </div>
        </UiSizeContext.Provider>
    )
}

export default UiSizeConstraint
