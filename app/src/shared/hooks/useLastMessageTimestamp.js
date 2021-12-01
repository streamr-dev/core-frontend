import { useEffect, useCallback, useReducer, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import useIsMounted from '$shared/hooks/useIsMounted'

const SET_TIMESTAMP = 'set timestamp'

const REFRESH = 'refresh'

const FAIL = 'fail'

const initialState = {
    error: undefined,
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
            return {
                ...state,
                error: action.error,
                timestamp: undefined,
            }
        default:
            return state
    }
}

const useLastMessageTimestamp = (streamId) => {
    const [{ timestamp, error, refreshedAt, refreshKey }, dispatch] = useReducer(reducer, initialState)

    const isMounted = useIsMounted()
    const client = useClient()

    const isFetchingRef = useRef(true)

    const refresh = useCallback(() => {
        // Skip updating `refreshKey` if we're already
        // in "fetching" mode.
        if (!isFetchingRef.current) {
            dispatch({
                type: REFRESH,
            })
            isFetchingRef.current = true
        }
    }, [])

    useEffect(() => {
        const attach = async () => {
            try {
                const [message] = await client.getStreamLast(streamId)

                if (isMounted()) {
                    dispatch({
                        type: SET_TIMESTAMP,
                        timestamp: (message || {}).timestamp,
                    })
                }
            } catch (e) {
                if (isMounted()) {
                    dispatch({
                        type: FAIL,
                        error: e,
                    })
                }
            } finally {
                isFetchingRef.current = false
            }
        }

        attach()
    }, [client, streamId, isMounted, refreshKey])

    return [timestamp, error, refresh, refreshedAt]
}

export default useLastMessageTimestamp
