/* eslint-disable react/no-unused-state */

import React, { useCallback, useEffect, useReducer, useMemo, useContext } from 'react'
import { setToken, getToken, setMethod, getMethod } from '$shared/utils/sessionToken'

const defaultContext = {
    token: null,
    setSessionToken: null,
    resetSessionToken: null,
}

const SessionContext = React.createContext(defaultContext)

export function useSession() {
    return useContext(SessionContext)
}

function useSessionProvider() {
    const [{ token, method }, updateState] = useReducer((state, nextState) => ({
        token: nextState.token !== undefined ? nextState.token : state.token,
        method: nextState.method !== undefined ? nextState.method : state.method,
    }), {
        token: getToken(),
        method: getMethod(),
    })

    useEffect(() => {
        // update storage when token changes
        setToken(token)
    }, [token])

    useEffect(() => {
        // update storage when method changes
        setMethod(method)
    }, [method])

    const setSessionToken = useCallback(({ token: nextToken, method: nextMethod }) => {
        updateState({
            token: nextToken,
            method: nextMethod,
        })
    }, [])

    const resetSessionToken = useCallback(() => {
        updateState({
            token: null,
            method: null,
        })
    }, [])

    return useMemo(() => ({
        setSessionToken,
        resetSessionToken,
        token,
    }), [
        setSessionToken,
        resetSessionToken,
        token,
    ])
}

function SessionProvider({ children }) {
    const value = useSessionProvider()

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}

export {
    SessionContext as Context,
    SessionProvider as Provider,
}
