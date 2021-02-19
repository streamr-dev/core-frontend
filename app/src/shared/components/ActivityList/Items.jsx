import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import emptyStateIcon from '$shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '$shared/assets/images/empty_state_icon@2x.png'
import Item from './Item'
import { StateContext, DispatchContext, SET_CATEGORY } from '.'

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
    margin-right: 24px;
    cursor: pointer;
    padding-bottom: 16px;
`

const Activities = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`

const EmptyState = styled.div`
    width: 100%;
    display: grid;
    grid-template-rows: 52px auto auto;
    justify-items: center;
    text-align: center;
    padding-top: 148px;
    color: #323232;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    h1 {
        font-size: 16px;
        font-weight: 400;
        line-height: 36px;
        margin-top: 50px;
    }

    span {
        font-size: 12px;
        line-height: 20px;
    }
`

const Items = () => {
    const { activities, category } = useContext(StateContext)

    const dispatch = useContext(DispatchContext)

    const onActivitiesClick = useCallback(() => {
        dispatch({
            type: SET_CATEGORY,
            category: 'activity',
        })
    }, [dispatch])

    const onNotificationsClick = useCallback(() => {
        dispatch({
            type: SET_CATEGORY,
            category: 'notifications',
        })
    }, [dispatch])

    return (
        <Container>
            <Tabs>
                <Tab
                    active={category === 'activity'}
                    onClick={onActivitiesClick}
                >
                    <Translate value="activityQueue.tab.activity" />
                </Tab>
                <Tab
                    active={category === 'notifications'}
                    onClick={onNotificationsClick}
                >
                    <Translate value="activityQueue.tab.notifications" />
                </Tab>
            </Tabs>
            <Activities>
                {activities.length === 0 && (
                    <EmptyState>
                        <img
                            src={emptyStateIcon}
                            srcSet={`${emptyStateIcon2x} 2x`}
                            alt="Not found"
                        />
                        {category === 'activity' && (
                            <React.Fragment>
                                <Translate value="activityQueue.activities.empty.title" tag="h1" />
                                <Translate value="activityQueue.activities.empty.message" tag="span" dangerousHTML />
                            </React.Fragment>
                        )}
                        {category === 'notifications' && (
                            <React.Fragment>
                                <Translate value="activityQueue.notifications.empty.title" tag="h1" />
                                <Translate value="activityQueue.notifications.empty.message" tag="span" dangerousHTML />
                            </React.Fragment>
                        )}
                    </EmptyState>
                )}
                {activities.map((activity) => (
                    <Item key={activity.id} activity={activity} />
                ))}
            </Activities>
        </Container>
    )
}

export default Items
