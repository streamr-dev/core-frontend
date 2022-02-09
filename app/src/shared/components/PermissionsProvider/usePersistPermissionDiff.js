import { useCallback, useRef } from 'react'
import { useClient } from 'streamr-client-react'

import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import useIsMounted from '$shared/hooks/useIsMounted'
import reducer, { PERSIST, SET_PERMISSIONS } from './utils/reducer'
import formatChangeset from './utils/formatChangeset'

export default function usePersistPermissionDiff() {
    const client = useClient()

    const dispatch = usePermissionsDispatch()

    const isMounted = useIsMounted()

    const { changeset, resourceId } = usePermissionsState()

    const busyRef = useRef(false)

    const saveRef = useRef(() => {})

    saveRef.current = async (onSuccess) => {
        const errors = {}

        const stream = await client.getStream(resourceId)

        if (!isMounted()) {
            return
        }

        try {
            await stream.setPermissions(...formatChangeset(changeset))
        } catch (e) {
            console.error(e)
        }

        try {
            const result = await stream.getPermissions()

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
