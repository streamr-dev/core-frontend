import React, { useMemo, useCallback, useState } from 'react'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'

const PermissionContext = React.createContext({
    permissions: [],
})

function usePermissionContext() {
    const [permissions, setPermissionState] = useState({})
    const isMountedRef = useIsMountedRef()

    const setPermissions = useCallback((permissions) => {
        if (!isMountedRef.current) { return }
        if (permissions == null) {
            throw new Error('permissions must be an array')
        }

        setPermissionState(permissions)
    }, [setPermissionState, isMountedRef])

    return useMemo(() => ({
        setPermissions,
        permissions,
    }), [permissions, setPermissions])
}

function PermissionContextProvider({ children }) {
    return (
        <PermissionContext.Provider value={usePermissionContext()}>
            {children || null}
        </PermissionContext.Provider>
    )
}

export {
    PermissionContextProvider as Provider,
    PermissionContext as Context,
}
