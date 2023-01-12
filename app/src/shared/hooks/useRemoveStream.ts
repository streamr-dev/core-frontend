import { useCallback, useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import confirmDialog from '$shared/utils/confirm'
import { networks } from '$shared/utils/constants'
import useRequireNetwork from '$shared/hooks/useRequireNetwork'
import useFetchPermission from '$shared/hooks/useFetchPermission'
import formatAssignments from '$shared/components/PermissionsProvider/utils/formatAssignments'
import { Operation } from '$shared/components/PermissionsProvider/operations'
import useInterrupt from '$shared/hooks/useInterrupt'
import getClientAddress from '$app/src/getters/getClientAddress'
export default function useRemoveStream() {
    const { validateNetwork } = useRequireNetwork(networks.STREAMS, false)
    const fetchPermission = useFetchPermission()
    const itp = useInterrupt()
    const client = useClient()
    useEffect(() => {
        // Interrupt deletion/removal if `client` changed. `itp` does not change.
        itp().interruptAll()
    }, [itp, client])
    return useCallback(
        async (streamId) => {
            const { requireUninterrupted } = itp(streamId)
            const canDelete = await fetchPermission(streamId, StreamPermission.DELETE)
            requireUninterrupted()
            const confirmed = await confirmDialog('stream', {
                title: `${canDelete ? 'Delete' : 'Remove'} this stream?`,
                message: 'This is an unrecoverable action. Please confirm this is what you want before you proceed.',
                acceptButton: {
                    title: `Yes, ${canDelete ? 'delete' : 'remove'}`,
                    kind: 'destructive',
                },
                centerButtons: true,
                dontShowAgain: false,
            })

            if (!confirmed) {
                return undefined
            }

            requireUninterrupted()
            await validateNetwork(true)
            requireUninterrupted()

            if (canDelete) {
                await client.deleteStream(streamId)
            } else {
                const user = await getClientAddress(client, {
                    suppressFailures: true,
                })
                requireUninterrupted()
                await client.setPermissions({
                    streamId,
                    assignments: formatAssignments({
                        [user]: Operation.None,
                    }),
                })
            }

            return canDelete
        },
        [itp, validateNetwork, fetchPermission, client],
    )
}
