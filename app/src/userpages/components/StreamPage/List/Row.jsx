import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import { titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'
import routes from '$routes'
import { deleteOrRemoveStream } from '$userpages/modules/userPageStreams/actions'
import Popover from '$shared/components/Popover'
import StatusIcon from '$shared/components/StatusIcon'
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
        <Translate value="userpages.streams.createStream" />
    </DesktopOnlyButton>
)

const Row = ({ stream, onShareClick: onShareClickProp }) => {
    const dispatch = useDispatch()
    const { copy } = useCopy()
    const fetchingPermissions = useSelector(selectFetchingPermissions)
    const permissions = useSelector(selectStreamPermissions)
    const { api: snippetDialog } = useModal('userpages.streamSnippet')

    const canBeDeletedByCurrentUser = (
        !fetchingPermissions &&
        permissions[stream.id] &&
        permissions[stream.id].includes('stream_delete')
    )

    const removeType = canBeDeletedByCurrentUser ? 'delete' : 'remove'

    const confirmDeleteStream = useCallback(async () => {
        const confirmed = await confirmDialog('stream', {
            title: I18n.t(`userpages.streams.${removeType}.confirmTitle`),
            message: I18n.t(`userpages.streams.${removeType}.confirmMessage`),
            acceptButton: {
                title: I18n.t(`userpages.streams.${removeType}.confirmButton`),
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            try {
                await dispatch(deleteOrRemoveStream(stream.id))

                Notification.push({
                    title: I18n.t(`userpages.streams.${removeType}.notification`),
                    icon: NotificationIcon.CHECKMARK,
                })
            } catch (e) {
                Notification.push({
                    title: e.message,
                    icon: NotificationIcon.ERROR,
                })
            }
        }
    }, [dispatch, stream.id, removeType])

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
        dispatch(push(routes.streams.show({
            id: stream.id,
        })))
    ), [dispatch, stream.id])

    const onCopyId = useCallback(() => {
        copy(stream.id)

        Notification.push({
            title: I18n.t('userpages.streams.actions.idCopied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy, stream.id])

    const [timestamp, refresh, refreshedAt] = useLastMessageTimestamp(stream.id)

    useEffect(() => {
        if (refreshedAt) {
            Notification.push({
                title: I18n.t('userpages.streams.actions.refreshSuccess'),
                icon: NotificationIcon.CHECKMARK,
            })
        }
    }, [refreshedAt])

    const status = getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    return (
        <StreamList.Row id={stream.id} onClick={showStream} data-test-hook={`Stream row for ${stream.id}`}>
            <StreamList.Title
                description={stream.description}
                moreInfo={timestamp && titleize(ago(new Date(timestamp)))}
            >
                {stream.name}
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
                    title={I18n.t('userpages.streams.actions.title')}
                    type="meatball"
                    noCaret
                    onMenuToggle={onToggleStreamDropdown}
                    menuProps={{
                        right: true,
                    }}
                >
                    <Popover.Item onClick={showStream}>
                        <Translate value="userpages.streams.actions.editStream" />
                    </Popover.Item>
                    <Popover.Item onClick={onCopyId}>
                        <Translate value="userpages.streams.actions.copyId" />
                    </Popover.Item>
                    <Popover.Item onClick={onOpenSnippetDialog}>
                        <Translate value="userpages.streams.actions.copySnippet" />
                    </Popover.Item>
                    <Popover.Item disabled={!canBeSharedByCurrentUser} onClick={onShareClick}>
                        <Translate value="userpages.streams.actions.share" />
                    </Popover.Item>
                    <Popover.Item onClick={refresh}>
                        <Translate value="userpages.streams.actions.refresh" />
                    </Popover.Item>
                    <Popover.Item onClick={confirmDeleteStream}>
                        <Translate value={`userpages.streams.actions.${removeType}`} />
                    </Popover.Item>
                </Popover>
            </StreamList.Actions>
        </StreamList.Row>
    )
}

export default Row
