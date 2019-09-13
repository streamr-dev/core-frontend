import { useCallback } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { handleLoadError } from '$auth/utils/loginInterceptor'
import usePending from '$shared/hooks/usePending'

import * as services from '../../services'
import useCanvasUpdater from './useCanvasUpdater'

export default function useCanvasLoadCallback() {
    const canvasUpdater = useCanvasUpdater()
    const { wrap } = usePending('canvas.LOAD')
    const isMountedRef = useIsMountedRef()
    return useCallback(async (canvasId) => (
        wrap(async () => {
            let canvas
            try {
                canvas = await services.loadRelevantCanvas({ id: canvasId })
            } catch (err) {
                if (!isMountedRef.current) { return }
                await handleLoadError(err)

                throw err
            }
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, canvasUpdater, isMountedRef])
}
