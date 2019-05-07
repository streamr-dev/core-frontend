import { useCallback } from 'react'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import usePending from '$editor/shared/hooks/usePending'

import * as services from '../../services'
import useCanvasUpdater from './useCanvasUpdater'

export default function useCanvasLoadCallback() {
    const canvasUpdater = useCanvasUpdater()
    const { wrap } = usePending('LOAD')
    const isMountedRef = useIsMountedRef()
    return useCallback(async (canvasId) => (
        wrap(async () => {
            const canvas = await services.loadRelevantCanvas({ id: canvasId })
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, canvasUpdater, isMountedRef])
}
