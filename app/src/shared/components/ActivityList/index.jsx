// @flow

import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import { getFilters } from '$userpages/utils/constants'
import { selectStreams } from '$userpages/modules/userPageStreams/selectors'
import { getStreams } from '$userpages/modules/userPageStreams/actions'
import { selectMyProductList } from '$mp/modules/myProductList/selectors'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectCanvases } from '$userpages/modules/canvas/selectors'
import { getCanvases } from '$userpages/modules/canvas/actions'

import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    width: 400px;
    height: 560px;
    display: flex;
    flex-direction: column;
`

const Tabs = styled.div`
    display: flex;
    width: 100%;
    padding: 16px 0 0 16px;
    border-bottom: 1px solid #f5f5f5;
`

const Tab = styled.div`
    display: flex;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: #323232;
    opacity: ${(props) => (props.active ? '1' : '0.5')};
    border-bottom: ${(props) => (props.active ? '1px solid #323232' : 'none')};
    position: relative;
    top: 1px;
    margin-right: 40px;
    cursor: pointer;
    padding-bottom: 16px;
`

const Items = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`

type Props = {
    activities: Array<Activity>,
}

const notificationFilter = (item: Activity) => (
    (item.action === actionTypes.PAYMENT || item.action === actionTypes.SHARE)
)

const activityFilter = (item: Activity) => (
    !notificationFilter(item)
)

const ActivityList = ({ activities }: Props) => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('activity')
    const streams = useSelector(selectStreams)
    const products = useSelector(selectMyProductList)
    const canvases = useSelector(selectCanvases)

    if (activities.some((n) => n.resourceType === resourceTypes.STREAM) && (streams == null || streams.length === 0)) {
        dispatch(getStreams({
            updateStatus: false,
        }))
    }

    if (activities.some((n) => n.resourceType === resourceTypes.PRODUCT) && (products == null || products.length === 0)) {
        dispatch(getMyProducts(getFilters().RECENT.filter))
    }

    if (activities.some((n) => n.resourceType === resourceTypes.CANVAS) && (canvases == null || canvases.length === 0)) {
        dispatch(getCanvases(getFilters().RECENT.filter))
    }

    const filter = activeTab === 'notifications' ? notificationFilter : activityFilter
    const items = activities.filter(filter)

    return (
        <Container>
            <Tabs>
                <Tab
                    active={activeTab === 'activity'}
                    onClick={() => setActiveTab('activity')}
                >
                    <Translate value="shared.activity" />
                </Tab>
                <Tab
                    active={activeTab === 'notifications'}
                    onClick={() => setActiveTab('notifications')}
                >
                    <Translate value="shared.notifications" />
                </Tab>
            </Tabs>
            <Items>
                {items.map((item, index) => {
                    const stream = item.resourceType === resourceTypes.STREAM ? streams.find((s) => s.id === item.resourceId) : undefined
                    const product = item.resourceType === resourceTypes.PRODUCT ? products.find((s) => s.id === item.resourceId) : undefined
                    const canvas = item.resourceType === resourceTypes.CANVAS ? canvases.find((s) => s.id === item.resourceId) : undefined
                    const resource = stream || product || canvas

                    return (
                        <ActivityListItem
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            activity={item}
                            resource={resource}
                            resourceType={item.resourceType}
                        />
                    )
                })}
            </Items>
        </Container>
    )
}

export default ActivityList
