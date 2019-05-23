// @flow

import aspectSize from './aspectSize'

type Props = {
    aspect: any,
    modulePreviews: any,
    screen: any,
}

export default ({ modulePreviews, aspect, screen }: Props) => {
    const bounds = modulePreviews.reduce((b, m) => ({
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
