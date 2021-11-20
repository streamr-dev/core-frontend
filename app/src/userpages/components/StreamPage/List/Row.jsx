import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { StatusIcon, titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'

import Popover from '$shared/components/Popover'
import confirmDialog from '$shared/utils/confirm'
import { NotificationIcon } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import Button from '$shared/components/Button'
import useCopy from '$shared/hooks/useCopy'
import { ago } from '$shared/utils/time'
import { LG } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import { StreamList } from '$shared/components/List'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import useIsMounted from '$shared/hooks/useIsMounted'
import routes from '$routes'
import useStreamPath from '../shared/useStreamPath'
import { normalizePermissions } from '../../StreamController/useLoadStreamCallback'

const DesktopOnlyButton = styled(Button)`
    && {
        display: none;
    }

    @media (min-width: ${LG}px) {
        && {
            display: inline-flex;
        }
    }
`

export const CreateStreamButton = () => (
    <DesktopOnlyButton
        tag={Link}
        to={routes.streams.new()}
    >
        Create stream
    </DesktopOnlyButton>
)

const Row = ({ stream, onShareClick: onShareClickProp, onRemoveStream: onRemoveStreamProp }) => {
    const history = useHistory()
    const { copy } = useCopy()
    const isMounted = useIsMounted()
    const [permissions, setPermissions] = useState([])
    const permissionsFetchedRef = useRef(false)

    const { api: snippetDialog } = useModal('userpages.streamSnippet')
    const { truncatedId } = useStreamPath(stream.id)

    const [canBeDeletedByCurrentUser, canBeSharedByCurrentUser] = useMemo(() => [
        permissions.includes('stream_delete'),
        permissions.includes('stream_share'),
    ], [permissions])

    const confirmDeleteStream = useCallback(async () => {
        const confirmed = await confirmDialog('stream', {
            title: `${canBeDeletedByCurrentUser ? 'Delete' : 'Remove'} this stream?`,
            message: 'This is an unrecoverable action. Please confirm this is what you want before you proceed.',
            acceptButton: {
                title: `Yes, ${canBeDeletedByCurrentUser ? 'delete' : 'remove'}`,
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            try {
                if (canBeDeletedByCurrentUser) {
                    await stream.delete()
                } else {
                    // fetch permissions again to get ids
                    const newPermissions = await stream.getMyPermissions()

                    await Promise.allSettled(newPermissions.map(({ id }) => stream.revokePermission(id)))
                }

                Notification.push({
                    title: `Stream ${canBeDeletedByCurrentUser ? 'deleted' : 'removed'} successfully`,
                    icon: NotificationIcon.CHECKMARK,
                })

                if (!isMounted()) { return }

                onRemoveStreamProp(stream)
            } catch (e) {
                console.warn(e)

                Notification.push({
                    title: `Stream ${canBeDeletedByCurrentUser ? 'deletion' : 'removal'} failed`,
                    icon: NotificationIcon.ERROR,
                })
            } finally {
                if (isMounted()) {
                    setPermissions([])
                }
            }
        }
    }, [stream, canBeDeletedByCurrentUser, onRemoveStreamProp, isMounted])

    const onToggleStreamDropdown = useCallback(async (open) => {
        if (open && !permissionsFetchedRef.current) {
            permissionsFetchedRef.current = true

            try {
                const permissions = await stream.getMyPermissions()

                if (isMounted()) {
                    setPermissions(normalizePermissions(permissions))
                }
            } catch (e) {
                // Noop.
            }
        }
    }, [stream, isMounted])

    const onShareClick = useCallback(() => {
        onShareClickProp(stream)
    }, [onShareClickProp, stream])

    const onOpenSnippetDialog = useCallback(async () => {
        await snippetDialog.open({
            streamId: stream.id,
        })
    }, [snippetDialog, stream.id])

    const showStream = useCallback(() => (
        history.push(routes.streams.show({
            id: stream.id,
        }))
    ), [history, stream.id])

    const onCopyId = useCallback(() => {
        copy(stream.id)

        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy, stream.id])

    const [timestamp, error, refresh, refreshedAt] = useLastMessageTimestamp(stream.id)

    useEffect(() => {
        // Initial status check is not a "refresh" that's why `refreshedAt`
        // is gonna be undefined. We're taking advantage of it here.

        if (refreshedAt) {
            Notification.push({
                title: 'Stream refreshed',
                icon: NotificationIcon.CHECKMARK,
            })
        }
    }, [refreshedAt])

    const status = error ? StatusIcon.ERROR : getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    return (
        <StreamList.Row id={stream.id} onClick={showStream} data-test-hook={`Stream row for ${stream.id}`}>
            <StreamList.Title
                description={stream.description}
                moreInfo={timestamp && titleize(ago(new Date(timestamp)))}
            >
                {truncatedId}
            </StreamList.Title>
            <StreamList.Item truncate title={stream.description}>
                {stream.description}
            </StreamList.Item>
            <StreamList.Item>
                {stream.lastUpdated && titleize(ago(new Date(stream.lastUpdated)))}
            </StreamList.Item>
            <StreamList.Item data-test-hook="Last message at">
                {timestamp && titleize(ago(new Date(timestamp)))}
            </StreamList.Item>
            <StreamList.Item>
                <StatusIcon status={status} tooltip />
            </StreamList.Item>
            <StreamList.Actions>
                <Popover
                    title="Actions"
                    type="meatball"
                    caret={false}
                    onMenuToggle={onToggleStreamDropdown}
                    menuProps={{
                        right: true,
                    }}
                >
                    <Popover.Item onClick={showStream}>
                        Edit stream
                    </Popover.Item>
                    <Popover.Item onClick={onCopyId}>
                        Copy ID
                    </Popover.Item>
                    <Popover.Item onClick={onOpenSnippetDialog}>
                        Copy Snippet
                    </Popover.Item>
                    <Popover.Item disabled={!canBeSharedByCurrentUser} onClick={onShareClick}>
                        Share
                    </Popover.Item>
                    <Popover.Item onClick={refresh}>
                        Refresh
                    </Popover.Item>
                    <Popover.Item onClick={confirmDeleteStream}>
                        {canBeDeletedByCurrentUser ? 'Delete' : 'Remove'}
                    </Popover.Item>
                </Popover>
            </StreamList.Actions>
        </StreamList.Row>
    )
}

export default Row
