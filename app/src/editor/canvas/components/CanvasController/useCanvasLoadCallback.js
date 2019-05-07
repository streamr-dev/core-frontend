import { useCallback } from 'react'
import useIsMountedRef from '$shared/utils/useIsMountedRef'

import * as services from '../../services'

import usePending from './usePending'
import useCanvasUpdater from './useCanvasUpdater'

export default function useCanvasLoadCallback() {
    const canvasUpdater = useCanvasUpdater()
    const { wrap } = usePending('LOAD')
    const isMountedRef = useIsMountedRef()
    return useCallback(async (canvasId) => (
        wrap(async () => {
            const canvas = await services.loadRelevantCanvas({ id: canvasId })
            // Get permissions and save them temporarily to canvas
            const permissions = await services.getCanvasPermissions({ id: canvas.id })
            canvas.permissions = permissions
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, canvasUpdater, isMountedRef])
}
