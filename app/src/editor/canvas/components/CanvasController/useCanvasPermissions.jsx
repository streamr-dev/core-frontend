import React, { useMemo, useCallback, useState, useEffect, useContext } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import usePending from '$shared/hooks/usePending'
import * as services from '../../services'
import useCanvas from './useCanvas'
import useEmbedMode from './useEmbedMode'

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
            const permissions = await services.getCanvasPermissions({ id: canvasId })
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

    const hasSharePermission = !!permissions &&
        permissions.some((p) => p.operation === 'share')

    const hasWritePermission = !isEmbedMode && !!permissions &&
        permissions.some((p) => p.operation === 'write')

    return useMemo(() => ({
        permissions,
        hasSharePermission,
        hasWritePermission,
    }), [permissions, hasSharePermission, hasWritePermission])
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
