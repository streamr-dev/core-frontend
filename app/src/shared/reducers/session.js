import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { setToken, getToken, setMethod, getMethod } from '$shared/utils/sessionToken'

const cleanState = {
    method: undefined,
    token: undefined,
}

const initialState = {
    ...cleanState,
    method: getMethod(),
    token: getToken(),
}

const Setup = 'session / setup'

export default function reducer(state = initialState, action) {
    if (action.type !== Setup) {
        return state
    }

    const [token, method] = action.payload || []

    return {
        method,
        token,
    }
}

function selectSession({ session = initialState } = {}) {
    return session
}

const selectSessionToken = createSelector(selectSession, ({ token }) => token)

export function useSessionToken() {
    return useSelector(selectSessionToken)
}

const selectSessionMethod = createSelector(selectSession, ({ method }) => method)

export function useSessionMethod() {
    return useSelector(selectSessionMethod)
}

export function setupSession([token, method]) {
    return (dispatch) => {
        setMethod(method)

        setToken(token)

        dispatch({
            type: Setup,
            payload: [token, method],
        })
    }
}
