// @flow

/* eslint-disable react/no-unused-state */

import React, { type Node, useEffect, useState, useMemo } from 'react'

import Context from '$auth/contexts/Session'
import { isLocalStorageAvailable } from '$shared/utils/storage'

const SESSION_TOKEN_KEY = 'session.token'

type Props = {
    children: Node,
}

const storage = isLocalStorageAvailable() ? window.localStorage : null

let cachedToken // fallback if no webstorage

function getStoredToken(): ?string {
    if (!storage) { return cachedToken || null }
    return storage.getItem(SESSION_TOKEN_KEY) || null
}

function storeToken(value?: ?string) {
    if (!storage) {
        cachedToken = value || null
        return
    }

    if (value) {
        storage.setItem(SESSION_TOKEN_KEY, value)
    } else {
        // remove entire key if not set
        storage.removeItem(SESSION_TOKEN_KEY)
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
