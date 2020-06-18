import { useCallback } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'
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
            } catch (error) {
                if (!isMountedRef.current) { return }
                if (canHandleLoadError(error)) {
                    await handleLoadError({
                        error,
                    })
                }

                throw error
            }
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, canvasUpdater, isMountedRef])
}
