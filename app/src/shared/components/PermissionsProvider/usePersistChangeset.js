import { useCallback, useRef, useEffect } from 'react'
import { useClient } from 'streamr-client-react'

import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import useIsMounted from '$shared/hooks/useIsMounted'
import useClientAddress from '$shared/hooks/useClientAddress'
import useStreamPermissionsInvalidator from '$shared/hooks/useStreamPermissionsInvalidator'
import useValidateNetwork from '$shared/hooks/useValidateNetwork'
import { networks } from '$shared/utils/constants'
import useInterrupt from '$shared/hooks/useInterrupt'
import InterruptionError from '$shared/errors/InterruptionError'
import reducer, { PERSIST, SET_PERMISSIONS, UNLOCK } from './utils/reducer'
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

    const validateNetwork = useValidateNetwork()

    useEffect(() => {
        saveRef.current = async (onSuccess) => {
            const errors = {}

            const assignments = formatAssignments(changeset)

            await validateNetwork(networks.STREAMS)

            await client.setPermissions({
                streamId: resourceId,
                assignments,
            })

            const { current: u } = userRef

            if (u && assignments.find((a) => a.user === u)) {
                // Pick current user from the changeset collection and trigger permission invalidation
                // via `StreamPermissionsInvalidatorContext` which then updates controls
                // on the stream page.
                invalidatePermissionsRef.current()
            }

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
        }
    }, [changeset, client, dispatch, isMounted, resourceId, validateNetwork])

    const itp = useInterrupt()

    return useCallback(async (onSuccess) => {
        const { requireUninterrupted } = itp('save')

        if (busyRef.current) {
            return
        }

        dispatch({
            type: PERSIST,
        })

        try {
            try {
                await saveRef.current(onSuccess)
            } finally {
                requireUninterrupted()
            }
        } catch (e) {
            if (e instanceof InterruptionError) {
                return
            }

            dispatch({
                type: UNLOCK,
            })
        }

        busyRef.current = false
    }, [itp, dispatch])
}
