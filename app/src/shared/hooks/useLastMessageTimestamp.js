import { useEffect, useCallback, useReducer, useRef } from 'react'
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

    const refreshKeyRef = useRef(refreshKey)

    useEffect(() => {
        refreshKeyRef.current = refreshKey

        const attach = async () => {
            try {
                await client.resend({
                    stream: streamId,
                    resend: {
                        last: 1,
                    },
                }, (message, { messageId: { timestamp: ts } }) => {
                    // Messages that arrive after unmounting and messages that come from a previous
                    // refresh are all ignored here.
                    if (isMounted() && refreshKeyRef.current === refreshKey) {
                        dispatch({
                            type: SET_TIMESTAMP,
                            timestamp: ts,
                        })
                    }
                })
            } catch (e) {
                if (isMounted()) {
                    dispatch({
                        type: FAIL,
                    })
                }
            }
        }

        if (client) {
            attach()
        }
    }, [client, streamId, isMounted, refreshKey])

    return [timestamp, refresh, refreshedAt]
}

export default useLastMessageTimestamp
