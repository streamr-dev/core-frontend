import React from 'react'
import { ModulePreview, aspectSize } from '$editor/canvas/components/Preview'
import { normalizeLayout, generateLayout } from './Dashboard'

export default function Preview({
    className,
    style,
    dashboard,
    aspect,
    screen,
    ...props
}) {
    const layout = normalizeLayout(generateLayout(dashboard))
    const itemLayout = layout.lg || layout[Object.keys(layout)[0]] || []
    const bounds = itemLayout.reduce((b, m) => (
        Object.assign(b, {
            maxX: Math.max(b.maxX, m.x + m.w),
            maxY: Math.max(b.maxY, m.y + m.h),
            minX: Math.min(b.minX, m.x),
            minY: Math.min(b.minY, m.y),
        })
    ), {
        maxX: -Infinity,
        maxY: -Infinity,
        minX: Infinity,
        minY: Infinity,
    })

    // set a minimum canvas size so a single module doesn't take up entire preview
    const minWidth = Math.max(bounds.maxX)
    const minHeight = Math.max(bounds.maxY)
    const canvasSize = aspectSize({
        height: aspect.height,
        width: aspect.width,
        minHeight,
        minWidth,
    })

    return (
        <svg
            className={className}
            preserveAspectRatio="none"
            viewBox={`0 0 ${aspect.width} ${aspect.height}`}
            style={{
                ...style,
                background: '#e7e7e7',
                padding: '8px',
            }}
            {...props}
        >
            <rect
                x="0"
                y="0"
                height="100%"
                width="100%"
                fill="#e7e7e7"
            />
            {!!itemLayout.length && (
                <svg
                    preserveAspectRatio="none"
                    viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
                >
                    {itemLayout.map((m, index) => (
                        <svg
                            key={m.i}
                            preserveAspectRatio="none"
                            viewBox={`0 0 ${m.w} ${m.h}`}
                            y={m.y}
                            x={m.x}
                            width={m.w}
                            height={m.h}
                        >
                            <g transform="scale(0.95)">
                                <ModulePreview
                                    um={0.2}
                                    title={dashboard.items[index].title}
                                    width={m.w}
                                    height={m.h}
                                    type={dashboard.items[index].webcomponent}
                                />
                            </g>
                        </svg>
                    ))}
                </svg>
            )}
        </svg>
    )
}

Preview.defaultProps = {
    aspect: {
        width: 318,
        height: 200,
    },
    screen: {
        width: 12,
        height: 12,
    },
}
