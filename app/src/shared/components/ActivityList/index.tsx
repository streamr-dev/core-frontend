import React, { useRef, useCallback, useReducer, useEffect, createContext } from 'react'
import { useSelector } from 'react-redux'
import { useSubscribe } from 'streamr-client-react'
import { selectPendingTransactions } from '$mp/modules/transactions/selectors'
import Activity, { actionTypes } from '$shared/utils/Activity'
import { isLocalStorageAvailable } from '$shared/utils/storage'
import { Hash } from '$shared/types/web3-types'
import { useFetchResource } from './ActivityResourceProvider'
import ActivityListItems from './ActivityListItems'
export const ACTIVITY_FROM = 30 * 24 * 60 * 60 * 1000 // 30 days

const notificationFilter = ({ action }: {action: string}) => action === actionTypes.PAYMENT || action === actionTypes.SHARE

const activityFilter = (item: any) => !notificationFilter(item)

export type ActivityListState = {
    activities: any[] // TODO add typing
    category: string
}

const storage = isLocalStorageAvailable() ? localStorage : null
const initialState: ActivityListState = {
    activities: [],
    category: 'activity',
}
export const SET_ACTIVITIES = 'activities/set'
export const SET_CATEGORY = 'category/set'

const reducer = (state: ActivityListState, action: {type: string, activities: any[], category?: string}) => {
    switch (action.type) {
        case SET_ACTIVITIES:
            return {
                ...state,
                activities: action.activities.filter(
                    state.category === 'activity' ? activityFilter : notificationFilter,
                ),
            }

        case SET_CATEGORY:
            return { ...state, category: action.category }

        default:
            throw new Error(`Unknown action: "${action.type}"`)
    }
}

export const StateContext = createContext(initialState)
export const DispatchContext = createContext<(action: {type: string, category?: string}) => void>(() => {})
export const useIsPendingTransaction = (txHash: Hash) => {
    const pendingTransactions = useSelector(selectPendingTransactions)
    return txHash && pendingTransactions.some(({ hash, state }) => hash === txHash && state === 'pending')
}

const ActivityList = ({ children = <ActivityListItems /> }) => {
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
    const fetchResource = useFetchResource()
    const onMessage = useCallback(
        // TODO add typing
        (msg: any) => {
            const activity = Activity.deserialize(msg)
            itemsRef.current = [activity, ...itemsRef.current]
            fetchResource(activity.resourceType, activity.resourceId)
            touch()
        },
        [fetchResource],
    )
    useSubscribe(streamId,
        {
            disabled: !streamId,
            onMessage,
            resendOptions: {
                from: {
                    timestamp: ACTIVITY_FROM,
                },
            },
        }
    )
    return (
        !!streamId && (
            <DispatchContext.Provider value={dispatch}>
                <StateContext.Provider value={state}>{children}</StateContext.Provider>
            </DispatchContext.Provider>
        )
    )
}

export default ActivityList
