import { useContext, useCallback } from 'react'

import * as RouterContext from '$editor/shared/components/RouterContext'
import useIsMountedRef from '$shared/utils/useIsMountedRef'
import usePending from '$editor/shared/hooks/usePending'

import * as services from '../../services'
import useCanvasUpdater from './useCanvasUpdater'

export default function useCanvasLoadCallback() {
    const { history } = useContext(RouterContext.Context)
    const canvasUpdater = useCanvasUpdater()
    const { wrap } = usePending('LOAD')
    const isMountedRef = useIsMountedRef()
    return useCallback(async (canvasId) => (
        wrap(async () => {
            let canvas
            try {
                canvas = await services.loadRelevantCanvas({ id: canvasId })
            } catch (err) {
                if (!isMountedRef.current) { return }
                if (!err.response) { throw err } // unexpected error
                history.replace('/404') // 404
            }
            // Get permissions and save them temporarily to canvas
            const permissions = await services.getCanvasPermissions({ id: canvas.id })
            canvas.permissions = permissions
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, canvasUpdater, history, isMountedRef])
}
