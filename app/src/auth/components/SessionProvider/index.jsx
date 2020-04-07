// @flow

/* eslint-disable react/no-unused-state */

import React, { type Node, useEffect, useState, useMemo } from 'react'

import Context from '$auth/contexts/Session'
import { isLocalStorageAvailable } from '$shared/utils/storage'

export const SESSION_TOKEN_KEY = 'session.token'
export const SESSION_LOGIN_TIME = 'session.loginTime'
export const EXPIRES_AT_VALID_HOURS = 6

type Props = {
    children: Node,
}

const storage = isLocalStorageAvailable() ? window.localStorage : null

let cachedToken // fallback if no webstorage
let cachedDate

function getStoredToken(): ?string {
    let date
    let token
    if (!storage) {
        token = cachedToken || null
        date = cachedDate || null
    } else {
        token = storage.getItem(SESSION_TOKEN_KEY) || null
        date = storage.getItem(SESSION_LOGIN_TIME) || null
        date = date ? new Date(date) : null
    }

    if (date) {
        // token expires after login time + interval
        date.setHours(date.getHours() + EXPIRES_AT_VALID_HOURS)

        return ((date.getTime() - Date.now()) > 0) ? token : null
    }

    return null
}

function storeToken(value?: ?string) {
    const loginTime = new Date()

    if (!storage) {
        cachedToken = value || null
        cachedDate = loginTime
        return
    }

    if (value) {
        storage.setItem(SESSION_TOKEN_KEY, value)
        storage.setItem(SESSION_LOGIN_TIME, loginTime)
    } else {
        // remove entire key if not set
        storage.removeItem(SESSION_TOKEN_KEY)
        storage.removeItem(SESSION_LOGIN_TIME)
    }
}

function SessionProvider(props: Props) {
    const { children } = props

    const [token, setSessionToken] = useState(getStoredToken())

    useEffect(() => {
        // update storage when token changes
        storeToken(token)
    }, [token])

    const sessionProvider = useMemo(() => ({
        setSessionToken,
        token,
    }), [setSessionToken, token])

    return (
        <Context.Provider value={sessionProvider}>
            {children}
        </Context.Provider>
    )
}

SessionProvider.token = (): ?string => getStoredToken()
SessionProvider.storeToken = storeToken

export default SessionProvider
