import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { Context as RouterContext } from '$shared/contexts/Router'
import usePending from '$shared/hooks/usePending'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'

import routes from '$routes'
import * as services from '../../services'

export default function useCanvasCreateCallback() {
    const { history } = useContext(RouterContext)
    const { isPending, wrap } = usePending('canvas.CREATE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async ({ replace = true } = {}) => {
        if (isPending) { return }
        return wrap(async () => {
            const newCanvas = await services.create()
            Activity.push({
                action: actionTypes.CREATE,
                resourceId: newCanvas.id,
                resourceType: resourceTypes.CANVAS,
            })

            if (!isMountedRef.current) { return }
            const dest = routes.canvases.edit({
                id: newCanvas.id,
            })
            if (replace) {
                history.replace(dest)
            } else {
                history.push(dest)
            }
        })
    }, [wrap, isPending, history, isMountedRef])
}
