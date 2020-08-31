import React, { useMemo, useCallback, useState, useEffect, useContext } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import usePending from '$shared/hooks/usePending'
import useCanvas from './useCanvas'
import useEmbedMode from './useEmbedMode'
import { getResourcePermissions } from '$userpages/modules/permission/services'

const PermissionContext = React.createContext({
    permissions: [],
})

function usePermissionContextValue() {
    const isEmbedMode = useEmbedMode()
    const [permissions, setPermissions] = useState()
    const isMountedRef = useIsMountedRef()
    const { wrap, isPending } = usePending('canvas.PERMISSIONS')
    const canvas = useCanvas()
    const canvasId = !!canvas && canvas.id
    const loadPermissions = useCallback(async (canvasId) => (
        wrap(async () => {
            const permissions = await getResourcePermissions({
                resourceType: 'CANVAS',
                resourceId: canvasId,
                id: 'me',
            })
            if (!isMountedRef.current) { return }
            setPermissions(permissions)
        })
    ), [wrap, setPermissions, isMountedRef])
    const hasPermissions = !!permissions
    // load permissions if needed
    useEffect(() => {
        if (!canvasId || isPending || hasPermissions) { return }
        loadPermissions(canvasId)
    }, [canvasId, hasPermissions, isPending, loadPermissions])

    const hasReadPermission = !!permissions &&
        permissions.some((p) => p.operation === 'canvas_get')

    const hasSharePermission = !!permissions &&
        permissions.some((p) => p.operation === 'canvas_share')

    const hasInteractPermission = !!permissions &&
        permissions.some((p) => p.operation === 'canvas_interact')

    // write, delete & start/stop not enabled when embedded
    const hasWritePermission = !isEmbedMode && !!permissions &&
        permissions.some((p) => p.operation === 'canvas_edit')

    const hasDeletePermission = !isEmbedMode && !!permissions &&
        permissions.some((p) => p.operation === 'canvas_delete')

    const hasStartStopPermission = !isEmbedMode && !!permissions &&
        permissions.some((p) => p.operation === 'canvas_startstop')

    return useMemo(() => ({
        permissions,
        hasReadPermission,
        hasSharePermission,
        hasWritePermission,
        hasDeletePermission,
        hasStartStopPermission,
        hasInteractPermission,
        loadPermissions,
    }), [
        permissions,
        hasReadPermission,
        hasSharePermission,
        hasWritePermission,
        hasDeletePermission,
        hasStartStopPermission,
        hasInteractPermission,
        loadPermissions,
    ])
}

function PermissionContextProvider({ children }) {
    return (
        <PermissionContext.Provider value={usePermissionContextValue()}>
            {children || null}
        </PermissionContext.Provider>
    )
}

function usePermissionContext() {
    return useContext(PermissionContext)
}

export default usePermissionContext

export {
    PermissionContextProvider as Provider,
    PermissionContext as Context,
}
