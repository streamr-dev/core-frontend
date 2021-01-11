import { useCallback, useRef } from 'react'
import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import reducer, { PERSIST, SET_PERMISSIONS } from './utils/reducer'
import useIsMounted from '$shared/hooks/useIsMounted'
import getPermissionsDiff from './utils/getPermissionsDiff'
import { getResourcePermissions, addResourcePermission, removeResourcePermission } from '$userpages/modules/permission/services'

export default function usePersistPermissionDiff() {
    const dispatch = usePermissionsDispatch()

    const isMounted = useIsMounted()

    const {
        changeset,
        combinations,
        raw,
        resourceType,
        resourceId,
    } = usePermissionsState()

    const busyRef = useRef(false)

    const saveRef = useRef(() => {})

    saveRef.current = async (onSuccess) => {
        const changes = getPermissionsDiff(resourceType, raw, combinations, changeset)

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

        if (!isMounted()) {
            return
        }

        try {
            const result = await getResourcePermissions({
                resourceId,
                resourceType,
            })

            if (!isMounted()) {
                return
            }

            const { changeset: newChangeset } = reducer({
                changeset,
            }, {
                permissions: result,
                type: SET_PERMISSIONS,
            })

            if (!Object.keys(newChangeset).length && !Object.keys(errors).length && typeof onSuccess === 'function') {
                onSuccess()
            } else {
                dispatch({
                    errors,
                    permissions: result,
                    type: SET_PERMISSIONS,
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    return useCallback(async (onSuccess) => {
        if (busyRef.current) {
            return
        }

        dispatch({
            type: PERSIST,
        })

        await saveRef.current(onSuccess)

        busyRef.current = false
    }, [dispatch])
}
