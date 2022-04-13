import { useCallback, useRef, useEffect } from 'react'
import { useClient } from 'streamr-client-react'

import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import useIsMounted from '$shared/hooks/useIsMounted'
import useClientAddress from '$shared/hooks/useClientAddress'
import useStreamPermissionsInvalidator from '$shared/hooks/useStreamPermissionsInvalidator'
import reducer, { PERSIST, SET_PERMISSIONS } from './utils/reducer'
import formatAssignments from './utils/formatAssignments'

export default function usePersistChangeset() {
    const client = useClient()

    const dispatch = usePermissionsDispatch()

    const isMounted = useIsMounted()

    const { changeset, resourceId } = usePermissionsState()

    const busyRef = useRef(false)

    const saveRef = useRef(() => {})

    const userRef = useRef()

    const user = useClientAddress()

    useEffect(() => {
        userRef.current = user
    }, [user])

    const invalidatePermissions = useStreamPermissionsInvalidator()

    const invalidatePermissionsRef = useRef(invalidatePermissions)

    useEffect(() => {
        invalidatePermissionsRef.current = invalidatePermissions
    }, [invalidatePermissions])

    saveRef.current = async (onSuccess) => {
        const errors = {}

        const assignments = formatAssignments(changeset)

        try {
            await client.setPermissions({
                streamId: resourceId,
                assignments,
            })
        } catch (e) {
            console.error(e)
        }

        const { current: u } = userRef

        if (u && assignments.find((a) => a.user === u)) {
            // Pick current user from the changeset collection and trigger permission invalidation
            // via `StreamPermissionsInvalidatorContext`) which then updates controls
            // on the stream page.
            invalidatePermissionsRef.current()
        }

        try {
            const result = await client.getPermissions(resourceId)

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
