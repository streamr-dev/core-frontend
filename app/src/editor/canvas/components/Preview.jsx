import React, { useMemo } from 'react'
import SharedPreview from '$editor/shared/components/Preview'
import { getModulePreviews, getPreviewData } from '$editor/shared/components/Preview/utils/getPreviewData'

import { getModuleForPort } from '../state'
import { Cable, getCableKey } from './Cables'

function getModuleKey(m) {
    return `${m.id}-${m.hash}`
}

function getPortPosition(portId, canvas, preview, previewScale) {
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
        width: p.width * previewScale,
        height: p.height * previewScale,
    }
}

const PreviewCables = ({ canvas, preview, previewScale }) => (
    Object.entries(canvas.modules.reduce((memo, { params, inputs, outputs }) => ({
        ...memo,
        ...[...params, ...inputs, ...outputs].reduce((memo2, { sourceId, id }) => {
            const from = getPortPosition(sourceId, canvas, preview, previewScale)
            const to = getPortPosition(id, canvas, preview, previewScale)
            const cable = [from, to]

            if (!from || !to) {
                return memo2
            }

            return {
                ...memo2,
                [getCableKey(cable)]: cable,
            }
        }, []),
    }), {})).map(([key, cable]) => (
        <Cable cable={cable} key={key} strokeWidth="0.2" />
    ))
)

export default function Preview({ canvas, aspect, screen, ...props }) {
    const modulePreviews = useMemo(() => getModulePreviews(canvas), [canvas])

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
            preview={preview}
            scale={scale}
            viewBoxScale={viewBoxScale}
            {...props}
        >
            <PreviewCables
                canvas={canvas}
                preview={preview}
                previewScale={scale}
            />
        </SharedPreview>
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
