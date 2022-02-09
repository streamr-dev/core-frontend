import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useClient } from 'streamr-client-react'

import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import useIsMounted from '$shared/hooks/useIsMounted'
import { selectUsername } from '$shared/modules/user/selectors'
import address0 from '$utils/address0'
import getPermissionsDiff from './utils/getPermissionsDiff'
import reducer, { PERSIST, SET_PERMISSIONS } from './utils/reducer'
import toOperationName from './utils/toOperationName'

export default function usePersistPermissionDiff() {
    const client = useClient()

    const userId = useSelector(selectUsername)

    const dispatch = usePermissionsDispatch()

    const isMounted = useIsMounted()

    const { changeset, combinations, resourceId } = usePermissionsState()

    const busyRef = useRef(false)

    const saveRef = useRef(() => {})

    saveRef.current = async (onSuccess) => {
        const changes = getPermissionsDiff(combinations, changeset)

        // We have to remove current user's `share` permission last. Otherwise consecutive permission
        // updates fail, obviously. Let's store it here and remove at the end (if exists).
        const grantPermission = changes.revoke.find(([u, op]) => (
            u === userId && op === toOperationName('grant')
        ))

        const selfRevokeAll = changes.revokeAll.includes(userId)

        const errors = {}

        const stream = await client.getStream(resourceId)
        if (!isMounted()) {
            return
        }

        const grant = async ([u, op]) => {
            try {
                if (u === address0) {
                    await stream.grantPublicPermission(op)
                } else {
                    await stream.grantUserPermission(op, u)
                }
            } catch (error) {
                console.error(error)
                errors[u] = error // Store failure but do not abort.
            }
        }

        const revoke = async ([u, op]) => {
            try {
                if (u === address0) {
                    await stream.revokePublicPermission(op)
                } else {
                    await stream.revokeUserPermission(op, u)
                }
            } catch (error) {
                console.error(error)
                errors[u] = error // Store failure but do not abort.
            }
        }

        const revokeAll = async (u) => {
            try {
                if (u === address0) {
                    await stream.revokeAllPublicPermissions()
                } else {
                    await stream.revokeAllUserPermissions(u)
                }
            } catch (error) {
                console.error(error)
                errors[u] = error // Store failure but do not abort.
            }
        }

        await Promise.all([
            ...changes.grant.map(grant),
            ...changes.revoke.map((p) => (
                p !== grantPermission ? revoke(p) : Promise.resolve()
            )),
            ...changes.revokeAll.map((u) => (
                u !== userId ? revokeAll(u) : Promise.resolve()
            )),
        ])

        if (!isMounted()) {
            return
        }

        if (grantPermission) {
            await revoke(grantPermission)
        }

        if (!isMounted()) {
            return
        }

        if (selfRevokeAll) {
            await revokeAll(userId)
        }

        if (!isMounted()) {
            return
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
