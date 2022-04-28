import { useSelector } from 'react-redux'
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

const selectSessionToken = ({ session }) => session.token

export function useSessionToken() {
    return useSelector(selectSessionToken)
}

const selectSessionMethod = ({ session }) => session.method

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
