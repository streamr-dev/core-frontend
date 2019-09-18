// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import ModulePreview from './ModulePreview'

import styles from './preview.pcss'

type Props = {
    x: number,
    y: number,
    aspect: {
        height: number,
        width: number,
    },
    children?: Node,
    className?: ?string,
    preview: any,
    scale: number,
    viewBoxScale: number,
}

const Preview = ({
    aspect,
    children,
    className,
    preview,
    scale,
    viewBoxScale,
    ...props
}: Props) => {
    const { x, y } = preview
    const viewBox = `${x} ${y} ${Math.round(aspect.width * viewBoxScale)} ${Math.round(aspect.height * viewBoxScale)}`
    return (
        <div
            className={cx(styles.root, className)}
        >
            <svg
                preserveAspectRatio="none"
                {...props}
                viewBox={viewBox}
            >
                {children}
                {preview.modules.map(({
                    height,
                    key,
                    x,
                    title,
                    y,
                    type,
                    width,
                }) => (
                    <ModulePreview
                        height={height * scale}
                        key={key}
                        title={title || ''}
                        type={type}
                        width={width * scale}
                        x={x * scale}
                        y={y * scale}
                    />
                ))}
            </svg>
        </div>
    )
}

export default Preview
