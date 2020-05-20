import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { Context as RouterContext } from '$shared/contexts/Router'
import usePending from '$shared/hooks/usePending'

import routes from '$routes'
import * as services from '../../services'

export default function useCanvasRemoveCallback() {
    const { history } = useContext(RouterContext)
    const { isPending, wrap } = usePending('canvas.REMOVE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async ({ id }) => {
        if (isPending) { return }
        return wrap(async () => {
            await services.deleteCanvas({ id })
            if (!isMountedRef.current) { return }
            history.push(routes.canvases.index())
        })
    }, [wrap, isPending, history, isMountedRef])
}
