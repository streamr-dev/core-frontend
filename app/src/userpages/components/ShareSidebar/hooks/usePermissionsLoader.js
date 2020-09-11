import { useCallback, useEffect } from 'react'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import useAsyncCallbackWithState from './useAsyncCallbackWithState'

export default function usePermissionsLoader({ resourceType, resourceId }) {
    const loadPermissionsCallback = useCallback(() => (
        getResourcePermissions({
            resourceType,
            resourceId,
        })
    ), [resourceType, resourceId])

    const [loadState, loadPermissions] = useAsyncCallbackWithState(loadPermissionsCallback)
    const hasProps = !!(resourceType && resourceId)
    const { hasStarted } = loadState
    useEffect(() => {
        if (hasStarted || !hasProps) { return }
        loadPermissions()
    }, [hasStarted, hasProps, loadPermissions])

    return [loadState, loadPermissions]
}
