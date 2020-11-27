/* eslint-disable react/no-unused-state */

import React, { useCallback, useEffect, useReducer, useMemo } from 'react'
import Context from '$auth/contexts/Session'
import { setToken, getToken, setMethod, getMethod } from '$shared/utils/sessionToken'

function SessionProvider(props) {
    const { children } = props

    const [{ token, method }, updateState] = useReducer((state, nextState) => ({
        token: nextState.token ? nextState.token : state.token,
        method: nextState.method ? nextState.method : state.method,
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

    const sessionProvider = useMemo(() => ({
        setSessionToken,
        token,
    }), [
        setSessionToken,
        token,
    ])

    return (
        <Context.Provider value={sessionProvider}>
            {children}
        </Context.Provider>
    )
}

export default SessionProvider
