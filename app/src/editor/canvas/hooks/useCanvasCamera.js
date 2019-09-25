import { useMemo, useCallback } from 'react'
import { getCanvasBounds } from '$editor/shared/utils/bounds'

import { useCameraContext } from '../components/Camera'

export default function useCanvasCamera({ canvas }) {
    const camera = useCameraContext()
    const fitCanvas = useCallback(() => {
        if (!canvas) { return }
        const { current: modulesEl } = camera.elRef
        const { width: fitWidth, height: fitHeight } = modulesEl.getBoundingClientRect()
        const padding = 100
        const boundsWidth = fitWidth - (padding * 2)
        const boundsHeight = fitHeight - (padding * 2)
        const bounds = getCanvasBounds(canvas, {
            // defaults if no bounds
            width: boundsWidth,
            height: boundsHeight,
        })
        return camera.fitBounds({
            ...bounds,
            fitWidth,
            fitHeight,
            padding,
        })
    }, [camera, canvas])

    return useMemo(() => ({
        fitCanvas,
    }), [fitCanvas])
}
