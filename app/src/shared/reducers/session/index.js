import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { setToken, getToken, setMethod } from '$shared/utils/sessionToken'
import { logout } from '$shared/modules/user/actions'
import InterruptionError from '$shared/errors/InterruptionError'
import { getUserData } from '$shared/modules/user/services'
import validateWeb3 from '$utils/web3/validateWeb3'
import getSessionToken from '$auth/utils/getSessionToken'
import { post } from '$shared/utils/api'
import getWeb3, { defaultFallbackProvider } from '$utils/web3/getWeb3'
import routes from '$routes'
import methods, { getRecentMethod } from './methods'

const cleanState = {
    connecting: false,
    error: undefined,
    method: undefined,
    token: undefined,
}

const recentMethod = getRecentMethod()

const initialState = {
    ...cleanState,
    method: recentMethod,
    token: getToken(),
}

const Init = 'session / init'

const Setup = 'session / setup'

const Teardown = 'session / teardown'

export default function reducer(state = initialState, action) {
    if (action.error && [Init, Setup, Teardown].includes(action.type)) {
        return {
            ...cleanState,
            error: action.payload,
            method: state.method,
        }
    }

    switch (action.type) {
        case Init:
            return {
                ...cleanState,
                connecting: true,
                method: action.payload,
            }
        case Setup:
            return {
                ...cleanState,
                ...action.payload,
            }
        case Teardown:
            return {
                ...cleanState,
            }
        default:
            return state
    }
}

export function teardownSession() {
    return async (dispatch) => {
        try {
            await post({
                url: routes.auth.external.logout(),
            })
        } catch (e) {
            // No-op.
        }

        dispatch(logout())

        dispatch({
            type: Teardown,
        })
    }
}

const defaultCancelPromise = new Promise(() => {}) // Uncancellable.

function defaultAborted() {
    return false
}

export function initSession(methodId, { cancelPromise = defaultCancelPromise, aborted = defaultAborted } = {}) {
    return async (dispatch) => {
        const method = methods.find(({ id }) => id === methodId)

        if (!method) {
            dispatch({
                type: Init,
                error: true,
                payload: new Error('Invalid method'),
            })
            return
        }

        setMethod(method.id)

        dispatch({
            type: Init,
            payload: method,
        })

        const web3 = getWeb3()

        try {
            let token

            web3.setProvider(method.getEthereumProvider())

            try {
                token = await Promise.race([
                    (async () => {
                        await validateWeb3({
                            requireNetwork: false,
                        })

                        return getSessionToken({
                            ethereum: web3.currentProvider,
                        })
                    })(),
                    cancelPromise,
                ])
            } finally {
                if (aborted()) {
                    // eslint-disable-next-line no-unsafe-finally
                    throw new InterruptionError()
                }
            }

            if (!token) {
                throw new Error('No token')
            }

            setToken(token)

            let user

            try {
                user = await getUserData()
            } finally {
                if (aborted()) {
                    // eslint-disable-next-line no-unsafe-finally
                    throw new InterruptionError()
                }
            }

            if (!user) {
                throw new Error('No user data')
            }

            dispatch({
                type: Setup,
                payload: {
                    method,
                    token,
                    web3,
                },
            })
        } catch (e) {
            await dispatch(teardownSession())

            if (e instanceof InterruptionError) {
                return
            }

            dispatch({
                type: Setup,
                error: true,
                payload: e,
            })
        }
    }
}

function selectSession({ session = initialState } = {}) {
    return session
}

const selectSessionToken = createSelector(selectSession, ({ token }) => token)

const selectSessionMethod = createSelector(selectSession, ({ method }) => method)

const selectSessionError = createSelector(selectSession, ({ error }) => error)

const selectSessionConnecting = createSelector(selectSession, ({ connecting }) => connecting)

export function useSessionToken() {
    return useSelector(selectSessionToken)
}

export function useSessionMethod() {
    return useSelector(selectSessionMethod)
}

export function useSessionError() {
    return useSelector(selectSessionError)
}

export function useSessionConnecting() {
    return useSelector(selectSessionConnecting)
}
