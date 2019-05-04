import React, { useMemo } from 'react'
import cx from 'classnames'

import { defaultModuleLayout, getModuleForPort } from '../state'
import isModuleResizable from '../utils/isModuleResizable'
import { Cable, getCableKey } from './Cables'

import styles from './Preview.pcss'

const ChartPreview = ({ height, width, y }) => {
    const chartHeight = height - 14
    const h = Math.floor(0.8 * chartHeight)

    return (
        <svg
            height={height}
            width={width}
            y={y}
        >
            <svg
                height={h}
                width="100%"
                y={Math.floor((chartHeight - h) / 2)}
            >
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern
                            height="66"
                            id="tile"
                            patternUnits="userSpaceOnUse"
                            width="112"
                        >
                            <path
                                // eslint-disable-next-line max-len
                                d="M0 53.167h3.004l4.05 3.404 7.623-9.428 3.387 6.286 3.388 9.428 1.482-3.143h5.293l3.6-3.143 3.176 6.286L36.697 66l3.387-6.286 5.082-18.857 1.693 6.286 3.388 9.428h3.176l3.811-3.142 1.906 3.142L62.316 44l3.599-18.857L68.879 0l1.694 6.286h1.906L75.654 22l1.694-6.286L79.254 22l1.482 15.714h3.6l3.175-9.428L90.9 22l1.694 3.143L94.43 27.5h1.693l3.306-3.725L102.002 33l2.515 1.841 2.38-5.15 1.736 17.452L112 53.167"
                                fill="none"
                                stroke="#FF5C00"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <svg viewBox="0 0 11200 66" preserveAspectRatio="xMinYMid slice">
                        <rect width="100%" height="100%" fill="url(#tile)" />
                    </svg>
                </svg>
            </svg>
            <rect
                fill="#EFEFEF"
                height="1"
                width="100%"
                y={height - 11}
            />
            <circle
                cx={4.5}
                cy={height - 5}
                r={1.5}
                fill="#FF5C00"
            />
            <rect
                fill="#D8D8D8"
                height="4"
                rx="1"
                width="23%"
                x="9"
                y={height - 7}
            />
        </svg>
    )
}

const TablePreview = ({ width, height, ...props }) => (
    <svg
        {...props}
        height={Math.floor((height + 4) / 8) * 8} // 8px per row; we don't wanna cut rows in half.
        width={width - 6}
        x={3}
    >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="paragraph" width="100%" height="16" patternUnits="userSpaceOnUse">
                    <g fill="#d8d8d8">
                        <rect width="15" rx="1" height="4" />
                        <rect width="19" rx="1" height="4" y="8" />
                        <rect width="19" rx="1" height="4" x="26" />
                        <rect width="24" rx="1" height="4" x="26" y="8" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paragraph)" />
        </svg>
    </svg>
)

export function aspectSize({ width, height, minWidth, minHeight }) {
    const ratio = Math.max(minWidth / width, minHeight / height)
    return {
        width: Math.round(width * ratio * 100) / 100,
        height: Math.round(height * ratio * 100) / 100,
    }
}

function getModuleKey(m) {
    return `${m.id}-${m.hash}`
}

function PreviewCables({ canvas, preview, previewScale }) {
    function getPosition(portId) {
        if (!portId) { return }
        let m
        try {
            m = getModuleForPort(canvas, portId)
        } catch (error) {
            // ignore error if problem with canvas/port
            return
        }
        const key = getModuleKey(m)
        const p = preview.modules.find((m) => m.key === key)
        return {
            id: m.id,
            left: (p.left + (p.width / 2)) * previewScale,
            top: (p.top + (p.height / 2)) * previewScale,
        }
    }

    const cables = canvas.modules.reduce((memo, { params, inputs, outputs }) => ({
        ...memo,
        ...(() => [...params, ...inputs, ...outputs].reduce((memo2, { sourceId, id }) => {
            const from = getPosition(sourceId)
            const to = getPosition(id)
            const cable = [from, to]

            if (!from || !to) {
                return memo2
            }

            return {
                ...memo2,
                [getCableKey(cable)]: cable,
            }
        }, {}))(),
    }), {})

    return Object.entries(cables).map(([key, cable]) => (
        <Cable cable={cable} key={key} strokeWidth="0.5" />
    ))
}

const ModulePreview = ({
    height,
    title,
    type,
    width,
    x,
    y,
    ...props
}) => (
    <svg
        height={height}
        width={width}
        x={x}
        y={y}
        {...props}
    >
        <rect
            fill="white"
            height="100%"
            rx="1"
            width="100%"
        />
        <rect
            fill="#D8D8D8"
            height="4"
            rx="1"
            width={Math.min(width * 0.75, title.length * 3)}
            x="3"
            y="3"
        />
        <rect
            fill="#EFEFEF"
            height="1"
            width="100%"
            y="10"
        />
        {type === 'streamr-chart' && (
            <ChartPreview
                height={height - 14}
                width={width}
                y={14}
            />
        )}
        {type === 'streamr-table' && (
            <TablePreview
                height={height - 17}
                width={width}
                y={14}
            />
        )}
    </svg>
)

const defaultLayout = {
    height: Number.parseInt(defaultModuleLayout.height, 10),
    width: Number.parseInt(defaultModuleLayout.width, 10),
}

function getPreviewCanvas({ canvas, aspect, screen }) {
    // grab basic module dimensions
    const modulePreviews = canvas.modules.map((m) => ({
        key: getModuleKey(m),
        top: Number.parseInt(m.layout.position.top, 10) || 0,
        left: Number.parseInt(m.layout.position.left, 10) || 0,
        height: Number.parseInt(m.layout.height, 10) || defaultLayout.height,
        width: Number.parseInt(m.layout.width, 10) || defaultLayout.width,
        isResizable: isModuleResizable(m),
        title: (m.displayName || m.name),
        type: m.uiChannel && m.uiChannel.webcomponent,
    }))

    // find bounds of modules
    const bounds = modulePreviews.reduce((b, m) => (
        Object.assign(b, {
            maxX: Math.max(b.maxX, m.left + m.width),
            maxY: Math.max(b.maxY, m.top + m.height),
            minX: Math.min(b.minX, m.left),
            minY: Math.min(b.minY, m.top),
        })
    ), {
        maxX: -Infinity,
        maxY: -Infinity,
        minX: Infinity,
        minY: Infinity,
    })

    const ratio = aspect.height / aspect.width

    // set a minimum canvas size so a single module doesn't take up entire preview
    const minWidth = Math.max(bounds.maxX, screen.width || screen.height * (1 / ratio))
    const minHeight = Math.max(bounds.maxY, screen.height || screen.width * ratio)

    // force dimensions to fit aspect
    const canvasSize = aspectSize({
        height: aspect.height,
        width: aspect.width,
        minHeight,
        minWidth,
    })

    return {
        width: canvasSize.width,
        height: canvasSize.height,
        modules: modulePreviews,
        bounds,
        minWidth,
        minHeight,
    }
}

export default function Preview({
    className,
    style,
    canvas,
    aspect,
    screen,
    ...props
}) {
    const preview = useMemo(() => (
        getPreviewCanvas({
            canvas,
            aspect,
            screen,
        })
    ), [canvas, aspect, screen])

    const scale = aspect.width / screen.width
    const viewBoxScale = preview.width / screen.width

    return (
        <svg
            className={cx(styles.Preview, className)}
            preserveAspectRatio="none"
            viewBox={`0 0 ${Math.round(aspect.width * viewBoxScale)} ${Math.round(aspect.height * viewBoxScale)}`}
            {...props}
        >
            <PreviewCables
                canvas={canvas}
                preview={preview}
                previewScale={scale}
            />
            {preview.modules.map(({
                height,
                key,
                left: x,
                title,
                top: y,
                type,
                width,
            }) => (
                <ModulePreview
                    height={height * scale}
                    key={key}
                    title={title}
                    type={type}
                    width={width * scale}
                    x={x * scale}
                    y={y * scale}
                />
            ))}
        </svg>
    )
}

Preview.defaultProps = {
    aspect: {
        width: 318,
        height: 200,
    },
    screen: {
        width: 1680,
        // calculate height based on aspect
    },
}
