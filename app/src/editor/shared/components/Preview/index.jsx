// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import ModulePreview from './ModulePreview'

import styles from './preview.pcss'

type Props = {
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
}: Props) => (
    <div
        className={cx(styles.root, className)}
    >
        <svg
            preserveAspectRatio="none"
            viewBox={`0 0 ${Math.round(aspect.width * viewBoxScale)} ${Math.round(aspect.height * viewBoxScale)}`}
            {...props}
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

export default Preview
