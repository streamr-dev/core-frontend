// @flow

import aspectSize from './aspectSize'
import { defaultModuleLayout } from '$editor/canvas/state'

type Props = {
    aspect: any,
    modulePreviews: any,
    screen: any,
}

function getModuleKey(m) {
    return `${m.id}-${m.hash}`
}

const defaultLayout = {
    height: Number.parseInt(defaultModuleLayout.height, 10),
    width: Number.parseInt(defaultModuleLayout.width, 10),
}

export function getModulePreviews(canvas: any) {
    return (
        canvas.modules.map((m) => ({
            key: getModuleKey(m),
            top: Number.parseInt(m.layout.position.top, 10) || 0,
            left: Number.parseInt(m.layout.position.left, 10) || 0,
            height: Number.parseInt(m.layout.height, 10) || defaultLayout.height,
            width: Number.parseInt(m.layout.width, 10) || defaultLayout.width,
            title: (m.displayName || m.name),
            type: (m.uiChannel && m.uiChannel.webcomponent) || m.widget || m.jsModule,
        }))
    )
}

function getModulePreviewBounds(previews: any) {
    return previews.reduce((b, m) => ({
        maxX: Math.max(b.maxX, m.left + m.width),
        maxY: Math.max(b.maxY, m.top + m.height),
        minX: Math.min(b.minX, m.left),
        minY: Math.min(b.minY, m.top),
    }), {
        maxX: -Infinity,
        maxY: -Infinity,
        minX: Infinity,
        minY: Infinity,
    })
}

export function getCanvasBounds(canvas: any) {
    return getModulePreviewBounds(getModulePreviews(canvas))
}

export function getPreviewData({ modulePreviews, aspect, screen }: Props) {
    const bounds = getModulePreviewBounds(modulePreviews)
    const ratio = aspect.height / aspect.width

    const minWidth = Math.max(bounds.maxX, screen.width || screen.height * (1 / ratio))
    const minHeight = Math.max(bounds.maxY, screen.height || screen.width * ratio)

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
    }
}

export default getPreviewData
