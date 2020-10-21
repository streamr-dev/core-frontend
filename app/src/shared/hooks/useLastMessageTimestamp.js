import { useEffect, useCallback, useReducer } from 'react'
import { useClient } from 'streamr-client-react'
import useIsMounted from '$shared/hooks/useIsMounted'

const SET_TIMESTAMP = 'set timestamp'

const REFRESH = 'refresh'

const FAIL = 'fail'

export const INVALID_TIMESTAMP = -1

const initialState = {
    refreshedAt: undefined,
    refreshKey: 0,
    timestamp: undefined,
}

const reducer = (state, action) => {
    switch (action.type) {
        case REFRESH:
            return {
                ...state,
                refreshKey: state.refreshKey + 1,
            }
        case SET_TIMESTAMP:
            return {
                ...state,
                refreshedAt: state.refreshKey ? new Date().getTime() : undefined,
                timestamp: action.timestamp,
            }
        case FAIL:
            return reducer(state, {
                type: SET_TIMESTAMP,
                timestamp: INVALID_TIMESTAMP,
            })
        default:
            return state
    }
}

const useLastMessageTimestamp = (streamId) => {
    const client = useClient()

    const [{ timestamp, refreshedAt, refreshKey }, dispatch] = useReducer(reducer, initialState)

    const isMounted = useIsMounted()

    const refresh = useCallback(() => {
        dispatch({
            type: REFRESH,
        })
    }, [])

    useEffect(() => {
        if (!client) {
            return () => {}
        }

        let last

        const onMessage = (_, { messageId: { timestamp: ts } }) => {
            last = ts
        }

        const sub = (() => {
            try {
                return client.subscribe({
                    stream: streamId,
                    resend: {
                        last: 1,
                    },
                }, onMessage)
            } catch (e) { /**/ }

            return null
        })()

        const onResendDone = () => {
            if (isMounted()) {
                dispatch({
                    type: SET_TIMESTAMP,
                    timestamp: last,
                })
            }

            sub.off('initial_resend_done', onResendDone)
            client.unsubscribe(sub)
        }

        if (sub) {
            sub.on('initial_resend_done', onResendDone)
        }

        return () => {
            if (sub) {
                sub.off('initial_resend_done', onResendDone)
                client.unsubscribe(sub)
            }
        }
    }, [client, streamId, isMounted, refreshKey])

    return [timestamp, refresh, refreshedAt]
}

export default useLastMessageTimestamp
