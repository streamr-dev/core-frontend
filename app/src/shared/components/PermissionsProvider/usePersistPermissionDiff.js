import { useCallback, useEffect, useRef } from 'react'
import { usePermissionsState, usePermissionsDispatch, PERSIST, REFETCH } from '$shared/components/PermissionsProvider'
import useIsMounted from '$shared/hooks/useIsMounted'
import getPermissionsDiff from './getPermissionsDiff'
import {
    addResourcePermission,
    removeResourcePermission,
} from '$userpages/modules/permission/services'

export default function usePersistPermissionDiff() {
    const dispatch = usePermissionsDispatch()

    const isMounted = useIsMounted()

    const {
        changeset,
        locked,
        permissions,
        raw,
        resourceType,
        resourceId,
    } = usePermissionsState()

    const busyRef = useRef(false)

    const saveRef = useRef(() => {})

    saveRef.current = async () => {
        const changes = getPermissionsDiff(resourceType, raw, permissions, changeset)

        const errors = {}

        const performer = (fn, dataTransform) => (data) => (
            fn({
                resourceType,
                resourceId,
                ...dataTransform(data),
            }).catch((error) => {
                console.error(error)
                // Store failure but do not abort.
                errors[data.anonymous ? 'anonymous' : data.user] = error
            })
        )

        const add = performer(addResourcePermission, (data) => ({
            data,
        }))

        const del = performer(removeResourcePermission, ({ id }) => ({
            id,
        }))

        await Promise.all([...changes.add.map(add), ...changes.del.map(del)])

        if (isMounted()) {
            dispatch({
                type: REFETCH,
                errors,
            })
        }
    }

    useEffect(() => {
        if (locked && !busyRef.current) {
            saveRef.current()
        }

        busyRef.current = locked
    }, [locked])

    const persist = useCallback(() => {
        dispatch({
            type: PERSIST,
        })
    }, [dispatch])

    return persist
}
