import { useCallback } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import confirmDialog from '$shared/utils/confirm'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { NotificationIcon, networks } from '$shared/utils/constants'
import useRequireNetwork from '$shared/hooks/useRequireNetwork'
import useFetchPermission from '$shared/hooks/useFetchPermission'
import formatAssignments from '$shared/components/PermissionsProvider/utils/formatAssignments'
import { NONE } from '$shared/components/PermissionsProvider/operations'
import useInterrupt from '$shared/hooks/useInterrupt'
import getClientAddress from '$app/src/getters/getClientAddress'
import Notification from '$shared/utils/Notification'

export default function useRemoveStream() {
    const { [StreamPermission.DELETE]: canDelete } = useStreamPermissions()

    const { validateNetwork } = useRequireNetwork(networks.STREAMS, false)

    const fetchPermission = useFetchPermission()

    const itp = useInterrupt()

    const client = useClient()

    return useCallback(async (streamId) => {
        const { requireUninterrupted } = itp(streamId)

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
            return
        }

        requireUninterrupted()

        try {
            await validateNetwork(true)

            requireUninterrupted()

            const stillCanDelete = await fetchPermission(StreamPermission.DELETE)

            requireUninterrupted()

            if (stillCanDelete) {
                await client.deleteStream(streamId)
            } else {
                const user = await getClientAddress(client, {
                    suppressFailures: true,
                })

                requireUninterrupted()

                await client.setPermissions({
                    streamId,
                    assignments: formatAssignments({
                        [user]: NONE,
                    }),
                })
            }

            requireUninterrupted()

            Notification.push({
                title: `Stream ${stillCanDelete ? 'deleted' : 'removed'} successfully`,
                icon: NotificationIcon.CHECKMARK,
            })
        } catch (e) {
            requireUninterrupted()

            Notification.push({
                title: `Stream ${canDelete ? 'deletion' : 'removal'} failed`,
                icon: NotificationIcon.ERROR,
            })

            console.warn(e)
        }
    }, [itp, validateNetwork, fetchPermission, canDelete, client])
}
