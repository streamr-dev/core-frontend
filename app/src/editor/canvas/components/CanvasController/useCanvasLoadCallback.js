import { useContext, useCallback } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import useIsMountedRef from '$shared/utils/useIsMountedRef'
import usePending from '$editor/shared/hooks/usePending'
import { Context as PermissionContext } from '$editor/canvas/hooks/useCanvasPermissions'

import * as services from '../../services'
import useCanvasUpdater from './useCanvasUpdater'

export default function useCanvasLoadCallback() {
    const { history } = useContext(RouterContext)
    const { setPermissions } = useContext(PermissionContext)
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
                return
            }
            const permissions = await services.getCanvasPermissions({ id: canvas.id })
            setPermissions(permissions)
            if (!isMountedRef.current) { return }
            canvasUpdater.replaceCanvas(() => canvas)
        })
    ), [wrap, setPermissions, canvasUpdater, history, isMountedRef])
}
