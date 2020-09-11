import { useContext, useCallback } from 'react'

import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { Context as RouterContext } from '$shared/contexts/Router'
import usePending from '$shared/hooks/usePending'
import { getResourcePermissions } from '$userpages/modules/permission/services'

import routes from '$routes'
import * as services from '../../services'

export default function useCanvasRemoveCallback() {
    const { history } = useContext(RouterContext)
    const { isPending, wrap } = usePending('canvas.REMOVE')
    const isMountedRef = useIsMountedRef()

    return useCallback(async ({ id }) => {
        if (isPending) { return }
        return wrap(async () => {
            const canvasPermissions = await getResourcePermissions({
                resourceType: 'CANVAS',
                resourceId: id,
                id: 'me',
            })

            const permissionIds = (canvasPermissions || []).reduce((result, { id, operation }) => ({
                ...result,
                [id]: operation,
            }), {})

            if (Object.values(permissionIds).includes('canvas_delete')) {
                await services.deleteCanvas({ id })
            } else {
                await services.deleteCanvasPermissions({
                    id,
                    permissionIds: Object.keys(permissionIds),
                })
            }

            if (!isMountedRef.current) { return }
            history.push(routes.canvases.index())
        })
    }, [wrap, isPending, history, isMountedRef])
}
