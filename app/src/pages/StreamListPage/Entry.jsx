import React, { useCallback, useEffect, useRef } from 'react'
import { StreamPermission } from 'streamr-client'
import { StatusIcon, titleize } from '@streamr/streamr-layout'
import { StreamList } from '$shared/components/List'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamPath from '$app/src/getters/getStreamPath'
import { ago } from '$shared/utils/time'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import Popover from '$shared/components/Popover'
import useStream from '$shared/hooks/useStream'
import useStreamPermissionsInvalidator from '$shared/hooks/useStreamPermissionsInvalidator'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import useEntryInteraction from './useEntryInteraction'

export default function Entry({
    onClick: onClickProp,
    onCopyId: onCopyIdProp,
    onRefresh,
    onRemoveClick: onRemoveClickProp,
    onShareClick: onShareClickProp,
    onSnippetsClick: onSnippetsClickProp,
}) {
    const stream = useStream()

    const invalidatePermissions = useStreamPermissionsInvalidator()

    const { [StreamPermission.GRANT]: canGrant, [StreamPermission.DELETE]: canDelete } = useStreamPermissions()

    const [timestamp, error, refresh, refreshedAt] = useLastMessageTimestamp(stream.id)

    const { truncatedId } = getStreamPath(stream.id)

    const onDropdownToggle = useCallback((open) => {
        if (open) {
            invalidatePermissions()
        }
    }, [invalidatePermissions])

    const status = error ? StatusIcon.ERROR : getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    const onClick = useEntryInteraction(onClickProp)

    const onCopyId = useEntryInteraction(onCopyIdProp)

    const onRemoveClick = useEntryInteraction(onRemoveClickProp)

    const onShareClick = useEntryInteraction(onShareClickProp)

    const onSnippetsClick = useEntryInteraction(onSnippetsClickProp)

    const onRefreshRef = useRef(onRefresh)

    useEffect(() => {
        onRefreshRef.current = onRefresh
    }, [onRefresh])

    useEffect(() => {
        if (refreshedAt != null && typeof onRefreshRef.current === 'function') {
            onRefreshRef.current()
        }
    }, [refreshedAt])

    return (
        <StreamList.Row id={stream.id} onClick={onClick} data-testid={`Stream row for ${stream.id}`}>
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
                    onMenuToggle={onDropdownToggle}
                    menuProps={{
                        right: true,
                    }}
                >
                    <Popover.Item onClick={onClick}>
                        Edit stream
                    </Popover.Item>
                    <Popover.Item onClick={onCopyId}>
                        Copy ID
                    </Popover.Item>
                    <Popover.Item onClick={onSnippetsClick}>
                        Copy Snippet
                    </Popover.Item>
                    <Popover.Item disabled={!canGrant} onClick={onShareClick}>
                        Share
                    </Popover.Item>
                    <Popover.Item onClick={refresh}>
                        Refresh
                    </Popover.Item>
                    <Popover.Item onClick={onRemoveClick}>
                        {canDelete ? 'Delete' : 'Remove'}
                    </Popover.Item>
                </Popover>
            </StreamList.Actions>
        </StreamList.Row>
    )
}
