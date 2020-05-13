import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { Context as RouterContext } from '$shared/contexts/Router'
import usePending from '$shared/hooks/usePending'

import routes from '$routes'
import { isRunning } from '../../state'
import * as services from '../../services'

import useCanvasPermissions from './useCanvasPermissions'

export default function useCanvasDuplicateCallback() {
    const { hasWritePermission } = useCanvasPermissions()
    const { history } = useContext(RouterContext)
    const { isPending, wrap } = usePending('canvas.DUPLICATE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async (canvas) => {
        if (isPending) { return }
        return wrap(async () => {
            if (hasWritePermission && !isRunning(canvas) && !canvas.adhoc) {
                canvas = await services.saveNow(canvas) // ensure canvas saved before duplicating
            }
            const newCanvas = await services.duplicateCanvas(canvas)
            if (!isMountedRef.current) { return }
            history.push(routes.canvases.edit({
                id: newCanvas.id,
            }))
        })
    }, [wrap, isPending, history, isMountedRef, hasWritePermission])
}
