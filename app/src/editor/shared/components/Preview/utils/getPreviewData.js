// @flow

import aspectSize from './aspectSize'
import { getModuleBounds, getBoundsOf } from '$editor/shared/utils/bounds'

type Props = {
    aspect: any,
    modulePreviews: any,
    screen: any,
}

function getModuleKey(m) {
    return `${m.id}-${m.hash}`
}

export function getModulePreviews(canvas: any) {
    return (
        canvas.modules.map((m) => ({
            key: getModuleKey(m),
            ...getModuleBounds(m),
            title: (m.displayName || m.name),
            type: (m.uiChannel && m.uiChannel.webcomponent) || m.widget || m.jsModule,
        }))
    )
}

export function getPreviewData({ modulePreviews, aspect, screen }: Props) {
    const bounds = getBoundsOf(modulePreviews)
    const ratio = aspect.height / aspect.width

    const minWidth = Math.max(bounds.width, screen.width || screen.height * (1 / ratio))
    const minHeight = Math.max(bounds.height, screen.height || screen.width * ratio)

    const canvasSize = aspectSize({
        height: aspect.height,
        width: aspect.width,
        minHeight,
        minWidth,
    })

    return {
        x: bounds.x,
        y: bounds.y,
        width: canvasSize.width,
        height: canvasSize.height,
        modules: modulePreviews,
    }
}

export default getPreviewData
