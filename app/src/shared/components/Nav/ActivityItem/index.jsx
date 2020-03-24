// @flow

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { Provider as ClientProvider } from '$shared/contexts/StreamrClient'
import Subscription from '$shared/components/Subscription'
import ActivityList from '$shared/components/ActivityList'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import Activity from '$shared/utils/Activity'
import SvgIcon from '$shared/components/SvgIcon'
import { isLocalStorageAvailable } from '$shared/utils/storage'

import DropdownItem from '../DropdownItem'

const ACTIVITY_FROM = 30 * 24 * 60 * 60 * 1000 // 30 days

const Icon = styled(SvgIcon)`
    height: 20px;
    width: 16px;
    display: flex;
    color: #a3a3a3;

    &:hover {
        color: #323232;
    }
`

const storage = isLocalStorageAvailable() ? localStorage : null

const ActivityItem = () => {
    const [activities, setActivities] = useState([])

    const onMessage = useCallback((msg) => {
        const activity = Activity.deserialize(msg)
        setActivities((prev) => (
            [activity, ...prev]
        ))
    }, [])

    const apiKey = useSelector(selectAuthApiKeyId)
    if (!apiKey) {
        // Break out here so that we will only create an authenticated client
        return null
    }

    const streamId = storage ? storage.getItem('user.activityStreamId') : null
    if (!streamId) {
        return null
    }

    return (
        <ClientProvider key={streamId}>
            <Subscription
                uiChannel={{
                    id: streamId,
                }}
                isActive
                onMessage={onMessage}
                resendFrom={ACTIVITY_FROM}
            />
            <DropdownItem
                toggle={(
                    <Icon name="alarmBell" />
                )}
                align="left"
                eatPadding={false}
            >
                <ActivityList activities={activities} />
            </DropdownItem>
        </ClientProvider>
    )
}

export default ActivityItem
