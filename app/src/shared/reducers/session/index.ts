import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { setToken, getToken, setMethod, getMethod } from '$shared/utils/sessionToken'
import { PayloadAction } from '$shared/types/common-types'
const cleanState: {method: string, token: string} = {
    method: undefined,
    token: undefined,
}
const initialState = { ...cleanState, method: getMethod(), token: getToken() }
const Setup = 'session / setup'
export default function reducer(state = initialState, action: PayloadAction<[string, string]>) {
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
export function setupSession([token, method]: [string, string] | []) {
    return (dispatch: any) => {
        setMethod(method)
        setToken(token)
        dispatch({
            type: Setup,
            payload: [token, method],
        })
    }
}
