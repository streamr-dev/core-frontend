import React, { useMemo } from 'react'
import cx from 'classnames'
import uniqueId from 'lodash/uniqueId'

import { defaultModuleLayout, getModuleForPort } from '../state'
import isModuleResizable from '../utils/isModuleResizable'
import { Cable, getCableKey } from './Cables'

import styles from './Preview.pcss'

function ChartPreview(props) {
    const uid = uniqueId('ChartPreview')
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 97 62" {...props}>
            <defs>
                <rect id={`b${uid}`} width="33.83" height="10.29" x="48.85" y="15.21" rx="0.85" />
                <filter id={`a${uid}`} width="108.9%" height="129.2%" x="-4.4%" y="-14.6%" filterUnits="objectBoundingBox">
                    <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
                    <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="0.5" />
                    <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                </filter>
                <ellipse id={`d${uid}`} cx="1.69" cy="1.71" rx="1.69" ry="1.71" />
                <filter id={`c${uid}`} width="188.7%" height="187.5%" x="-44.3%" y="-43.7%" filterUnits="objectBoundingBox">
                    <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
                    <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="0.5" />
                    <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                </filter>
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(1)">
                <path stroke="#EFEFEF" strokeLinecap="square" d="M.46 51.5h95.01" />
                {/* eslint-disable-next-line max-len */}
                <path stroke="#FF5C00" strokeLinejoin="round" strokeWidth="0.63" d="M0 29h3l4.05 1.86 7.61-5.15 3.38 3.43 3.38 5.15 1.48-1.72h5.29l3.6-1.71 3.17 3.43L36.65 36l3.38-3.43 5.08-10.28 1.69 3.42 3.38 5.15h3.17l3.81-1.72 1.9 1.72L62.23 24l3.6-10.29L68.79 0l1.69 3.43h1.9L75.56 12l1.69-3.43 1.9 3.43 1.48 8.57h3.6l3.17-5.14L90.78 12l1.69 1.71L94.31 15H96" />
                <g opacity="0.96">
                    <use fill="#000" filter={`url(#a${uid})`} xlinkHref={`#b${uid}`} />
                    <use fill="#FFF" xlinkHref={`#b${uid}`} />
                </g>
                <rect width="24" height="4" x="50.85" y="18.21" fill="#D8D8D8" rx="1" />
                <g transform="translate(64.5 10.29)">
                    <use fill="#000" filter={`url(#c${uid})`} xlinkHref={`#d${uid}`} />
                    <use fill="#FFF" xlinkHref={`#d${uid}`} />
                    <ellipse cx="1.69" cy="1.71" fill="#FF5C00" rx="1" ry="1" />
                </g>
                <rect width="15" height="4" x="11.85" y="55" fill="#D8D8D8" rx="1" />
                <circle cx="6" cy="57" r="2" fill="#FF5C00" />
            </g>
        </svg>
    )
}

function TablePreview(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 56 40" {...props}>
            <g fill="#D8D8D8" fillRule="evenodd" transform="translate(-3 -5)">
                <rect width="15" height="4" x="3" y="5" rx="1" />
                <rect width="19" height="4" x="3" y="13" rx="1" />
                <rect width="19" height="4" x="29" y="5" rx="1" />
                <rect width="24" height="4" x="29" y="13" rx="1" />
                <rect width="15" height="4" x="3" y="21" rx="1" />
                <rect width="19" height="4" x="29" y="21" rx="1" />
                <rect width="19" height="4" x="3" y="29" rx="1" />
                <rect width="24" height="4" x="29" y="29" rx="1" />
                <rect width="15" height="4" x="3" y="37" rx="1" />
                <rect width="19" height="4" x="29" y="37" rx="1" />
            </g>
        </svg>
    )
}

function aspectSize({ width, height, minWidth, minHeight }) {
    const ratio = Math.max(minWidth / width, minHeight / height)
    return {
        width: Math.round(width * ratio * 100) / 100,
        height: Math.round(height * ratio * 100) / 100,
    }
}

function getModuleKey(m) {
    return `${m.id}-${m.hash}`
}

function PreviewCables({ canvas, preview }) {
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
            left: p.left + (p.width / 2),
            top: p.top + (p.height / 2),
        }
    }

    const cables = canvas.modules
        .reduce((c, m) => {
            [].concat(m.params, m.inputs, m.outputs).forEach((port) => {
                if (!port.connected) { return }
                c.push([port.sourceId, port.id])
            })
            return c
        }, [])
        .map(([from, to]) => [getPosition(from), getPosition(to)])
        .filter(([from, to]) => from && to)

    const uniqueCables = cables.reduce((o, cable) => (
        Object.assign(o, { [getCableKey(cable)]: cable })
    ), {})

    return (
        <React.Fragment>
            {Object.entries(uniqueCables).map(([key, cable]) => (
                <Cable cable={cable} key={key} />
            ))}
        </React.Fragment>
    )
}

function getHeaderHeight(um) {
    return (um * 3.333)
}

function getPortsHeight(um, portRows) {
    return (portRows * um * 1.1) + um
}

export function ModulePreview({
    x = 0,
    y = 0,
    height,
    width,
    um = 16,
    title = ' ',
    type = '',
    portRows = 0,
}) {
    x = Math.round(x)
    y = Math.round(y)
    width = Math.round(width)
    height = Math.round(height)

    const titleMaxWidth = width - (2 * um)
    const titleActualWidth = Math.min(title.length * um, titleMaxWidth)
    const headerBottomY = y + getHeaderHeight(um)
    const portsBottomY = headerBottomY + getPortsHeight(um, portRows)
    return (
        <g className={cx(styles.ModulePreview, styles[type])}>
            <rect
                className={styles.ModulePreviewBackground}
                x={x}
                y={y}
                height={height}
                width={width}
            />
            <rect
                className={styles.ModulePreviewHeaderText}
                x={x + um}
                y={y + um}
                width={titleActualWidth}
                height={um * 1.3}
            />
            <path
                className={styles.ModulePreviewBottomBorder}
                d={`M${x},${headerBottomY} H${x + width}`}
            />
            {type !== 'GenericModule' && portRows && (
                <path
                    className={styles.ModulePreviewBottomBorder}
                    d={`M${x},${portsBottomY} H${x + width}`}
                />
            )}
            {type === 'ChartModule' && (
                <ChartPreview preserveAspectRatio="xMinYMax slice" width={width} height={height - (portsBottomY - y)} x={x} y={portsBottomY} />
            )}
            {type === 'TableModule' && (
                <TablePreview
                    preserveAspectRatio="xMinYMin slice"
                    width={width}
                    height={height - (portsBottomY - y)}
                    x={x}
                    y={portsBottomY}
                />
            )}
        </g>
    )
}

const defaultLayout = {
    height: Number.parseInt(defaultModuleLayout.height, 10),
    width: Number.parseInt(defaultModuleLayout.width, 10),
}

function getPortRows({ inputs = [], outputs = [], params = [] }) {
    return Math.max(inputs.length + params.length, outputs.length)
}

function getPreviewCanvas({ canvas, aspect, screen, um = 20 }) {
    // grab basic module dimensions
    const modulePreviews = canvas.modules.map((m) => ({
        key: getModuleKey(m),
        top: Number.parseInt(m.layout.position.top, 10) || 0,
        left: Number.parseInt(m.layout.position.left, 10) || 0,
        height: Number.parseInt(m.layout.height, 10) || defaultLayout.height,
        width: Number.parseInt(m.layout.width, 10) || defaultLayout.width,
        isResizable: isModuleResizable(m),
        portRows: getPortRows(m),
        title: (m.displayName || m.name),
        type: module.widget || m.jsModule,
    }))
        .map((m) => (
            // set sensible min-height on non-resizable modules using number of ports
            Object.assign(m, {
                height: Math.max(m.height, getHeaderHeight(um) + getPortsHeight(um, m.portRows)),
            })
        ))

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
            um: 20,
        })
    ), [canvas, aspect, screen])

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
            <svg
                preserveAspectRatio="none"
                viewBox={`0 0 ${preview.width} ${preview.height}`}
            >
                <PreviewCables canvas={canvas} preview={preview} />
                {preview.modules.map((m) => (
                    <ModulePreview
                        key={m.key}
                        y={m.top}
                        x={m.left}
                        width={m.width}
                        height={m.height}
                        title={m.title}
                        type={m.type}
                        portRows={m.portRows}
                    />
                ))}
            </svg>
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
