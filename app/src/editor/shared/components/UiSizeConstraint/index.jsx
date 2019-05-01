// @flow

import React, { type Node, useContext } from 'react'
import cx from 'classnames'
import { Context as ResizableContext } from '$editor/canvas/components/Resizable'
import { Context as SizeConstraintContext } from '$editor/canvas/components/Resizable/SizeConstraintProvider'
import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
import styles from './uiSizeConstraint.pcss'

type Props = {
    children?: Node,
    className?: ?string,
    minHeight: number,
    minWidth: number,
}

const UiSizeConstraint = ({ children, className, minWidth: minWidthProp, minHeight: minHeightProp }: Props) => {
    const { height, width } = useContext(ResizableContext)
    const { minHeight } = useContext(SizeConstraintContext)

    return (
        <div
            className={cx(styles.root, className)}
            style={{
                height: (height - minHeight) + minHeightProp,
                minHeight: minHeightProp,
                minWidth: minWidthProp,
                width,
            }}
        >
            <Probe group="ModuleHeight" uid="UI" height={minHeightProp} />
            <Probe group="UiWidth" uid="UI" width={minWidthProp} />
            {children}
        </div>
    )
}

export default UiSizeConstraint
