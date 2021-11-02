import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { StatusIcon, titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'

import { deleteOrRemoveStream } from '$userpages/modules/userPageStreams/actions'
import Popover from '$shared/components/Popover'
import confirmDialog from '$shared/utils/confirm'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectFetchingPermissions, selectStreamPermissions } from '$userpages/modules/permission/selectors'
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
import routes from '$routes'
import useStreamPath from '../shared/useStreamPath'

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

const Row = ({ stream, onShareClick: onShareClickProp }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { copy } = useCopy()
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectStreamPermissions)
    const { api: snippetDialog } = useModal('userpages.streamSnippet')
    const { truncatedId } = useStreamPath(stream.id)

    const canBeDeletedByCurrentUser = (
        !fetchingPermissions &&
        permissions[stream.id] &&
        permissions[stream.id].includes('stream_delete')
    )

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
                await dispatch(deleteOrRemoveStream(stream.id))

                Notification.push({
                    title: `Stream ${canBeDeletedByCurrentUser ? 'deleted' : 'removed'} successfully`,
                    icon: NotificationIcon.CHECKMARK,
                })
            } catch (e) {
                console.warn(e)

                Notification.push({
                    title: `Stream ${canBeDeletedByCurrentUser ? 'deletion' : 'removal'} failed`,
                    icon: NotificationIcon.ERROR,
                })
            }
        }
    }, [dispatch, stream.id, canBeDeletedByCurrentUser])

    const onToggleStreamDropdown = useCallback(async (open) => {
        if (open && !fetchingPermissions && !permissions[stream.id]) {
            try {
                await dispatch(getResourcePermissions('STREAM', stream.id))
            } catch (e) {
                // Noop.
            }
        }
    }, [dispatch, fetchingPermissions, permissions, stream.id])

    const canBeSharedByCurrentUser = (
        !fetchingPermissions &&
        permissions[stream.id] &&
        permissions[stream.id].includes('stream_share')
    )

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
