import React, { useMemo } from 'react'
import SharedPreview from '$editor/shared/components/Preview'
import getPreviewData from '$editor/shared/components/Preview/utils/getPreviewData'
import { normalizeLayout, generateLayout } from './Dashboard'

export default function Preview({
    className,
    style,
    dashboard,
    aspect,
    screen,
    ...props
}) {
    const modulePreviews = useMemo(() => {
        const layout = normalizeLayout(generateLayout(dashboard))
        const items = layout.lg || layout[Object.keys(layout)[0]] || []
        return items.map(({
            h,
            i: key,
            title,
            type,
            w,
            x,
            y,
        }) => ({
            // 0.15 makes the module slightly smaller which mimics a margin
            // and lets us having a bit of empty space between modules.
            height: h - 0.15,
            key,
            x,
            title,
            y,
            type,
            width: w - 0.15,
        }))
    }, [dashboard])

    const preview = useMemo(() => (
        getPreviewData({
            modulePreviews,
            aspect,
            screen,
        })
    ), [modulePreviews, aspect, screen])

    const scale = aspect.width / screen.width

    const viewBoxScale = preview.width / screen.width

    return (
        <SharedPreview
            aspect={aspect}
            className={className}
            preview={preview}
            scale={scale}
            viewBoxScale={viewBoxScale}
            {...props}
        />
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
