import { useCallback, useRef, useEffect } from 'react'
import { usePermissionsState, usePermissionsDispatch } from '$shared/components/PermissionsProvider'
import useIsMounted from '$shared/hooks/useIsMounted'
import useStreamPermissionsInvalidator from '$shared/hooks/useStreamPermissionsInvalidator'
import useValidateNetwork from '$shared/hooks/useValidateNetwork'
import { networks } from '$shared/utils/constants'
import useInterrupt from '$shared/hooks/useInterrupt'
import { useAuthController } from '$auth/hooks/useAuthController'
import InterruptionError from '$shared/errors/InterruptionError'
import getTransactionalClient from '$app/src/getters/getTransactionalClient'
import reducer, { PERSIST, SET_PERMISSIONS, UNLOCK } from './utils/reducer'
import formatAssignments from './utils/formatAssignments'

export default function usePersistChangeset() {
    const dispatch = usePermissionsDispatch()
    const isMounted = useIsMounted()
    const { changeset } = usePermissionsState()
    const busyRef = useRef(false)
    const saveRef = useRef<(streamId: string, onSuccess: () => void) => Promise<void>>(() => Promise.resolve())
    const userRef = useRef<string>()
    const { currentAuthSession } = useAuthController()

    useEffect(() => {
        userRef.current = currentAuthSession.address
    }, [currentAuthSession.address])

    const invalidatePermissions = useStreamPermissionsInvalidator()
    const invalidatePermissionsRef = useRef(invalidatePermissions)

    useEffect(() => {
        invalidatePermissionsRef.current = invalidatePermissions
    }, [invalidatePermissions])

    const validateNetwork = useValidateNetwork()

    useEffect(() => {
        saveRef.current = async (streamId, onSuccess) => {
            const errors = {}
            const assignments = formatAssignments(changeset)
            await validateNetwork(networks.STREAMS)

            /**
             * @FIXME: We have to validate if we're on the correct network.
             */
            const client = await getTransactionalClient()
            await client.setPermissions({
                streamId,
                assignments,
            })
            const { current: u } = userRef

            if (u && assignments.find((a) => a.user === u)) {
                // Pick current user from the changeset collection and trigger permission invalidation
                // via `StreamPermissionsInvalidatorContext` which then updates controls
                // on the stream page.
                invalidatePermissionsRef.current()
            }

            const result = await client.getPermissions(streamId)

            if (!isMounted()) {
                return
            }

            const { changeset: newChangeset } = reducer(
                {
                    changeset,
                },
                {
                    permissions: result,
                    type: SET_PERMISSIONS,
                },
            )

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
    }, [changeset, dispatch, isMounted, validateNetwork])

    const itp = useInterrupt()
    return useCallback(
        async (streamId: string, onSuccess?: () => void) => {
            const { requireUninterrupted } = itp('save')

            if (busyRef.current) {
                return
            }

            dispatch({
                type: PERSIST,
            })

            try {
                try {
                    await saveRef.current(streamId, onSuccess)
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

                throw e
            }

            busyRef.current = false
        },
        [itp, dispatch],
    )
}
