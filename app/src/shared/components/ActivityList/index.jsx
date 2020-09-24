import React, { useRef, useCallback, useReducer, useEffect, createContext } from 'react'
import { useSelector } from 'react-redux'
import { selectPendingTransactions } from '$mp/modules/transactions/selectors'
import Activity, { actionTypes } from '$shared/utils/Activity'
import { isLocalStorageAvailable } from '$shared/utils/storage'
import { Provider as ClientProvider } from '$shared/contexts/StreamrClient'
import Subscription from '$shared/components/Subscription'
import { useFetchResource } from './ActivityResourceProvider'
import Items from './Items'

export const ACTIVITY_FROM = 30 * 24 * 60 * 60 * 1000 // 30 days

const notificationFilter = ({ action }) => (
    (action === actionTypes.PAYMENT || action === actionTypes.SHARE)
)

const activityFilter = (item) => (
    !notificationFilter(item)
)

const storage = isLocalStorageAvailable() ? localStorage : null

const initialState = {
    activities: [],
    category: 'activity',
}

export const SET_ACTIVITIES = 'activities/set'

export const SET_CATEGORY = 'category/set'

const reducer = (state, action) => {
    switch (action.type) {
        case SET_ACTIVITIES:
            return {
                ...state,
                activities: action.activities.filter(state.category === 'activity' ? activityFilter : notificationFilter),
            }
        case SET_CATEGORY:
            return {
                ...state,
                category: action.category,
            }
        default:
            throw new Error(`Unknown action: "${action.type}"`)
    }
}

export const StateContext = createContext(initialState)

export const DispatchContext = createContext(() => {})

export const useIsPendingTransaction = (txHash) => {
    const pendingTransactions = useSelector(selectPendingTransactions)

    return txHash && pendingTransactions.some(({ hash, state }) => hash === txHash && state === 'pending')
}

const ActivityList = ({ children = <Items /> }) => {
    const itemsRef = useRef([])

    const [state, dispatch] = useReducer(reducer, initialState)

    const streamId = storage && process.env.ACTIVITY_QUEUE ? storage.getItem('user.activityStreamId') : undefined

    const [touchCount, touch] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        dispatch({
            type: SET_ACTIVITIES,
            activities: itemsRef.current,
        })
    }, [state.category, touchCount])

    const fetch = useFetchResource()

    const onMessage = useCallback((msg) => {
        const activity = Activity.deserialize(msg)

        itemsRef.current = [activity, ...itemsRef.current]

        fetch(activity.resourceType, activity.resourceId)

        touch()
    }, [fetch])

    return !!streamId && (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <ClientProvider>
                    <Subscription
                        uiChannel={{
                            id: streamId,
                        }}
                        isActive
                        onMessage={onMessage}
                        resendFrom={ACTIVITY_FROM}
                    />
                    {children}
                </ClientProvider>
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

Object.assign(ActivityList, {
    Items,
})

export default ActivityList
