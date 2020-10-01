/* eslint-disable import/no-extraneous-dependencies */
// @flow

/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { type Context, useMemo } from 'react'
import Provider, { useClient } from 'streamr-client-react'
import StreamrClient from 'streamr-client'
import { getToken } from '$shared/utils/sessionToken'

import useIsSessionTokenReady from '$shared/hooks/useIsSessionTokenReady'

export type ContextProps = {
    hasLoaded: boolean,
    client: any,
}

export const ClientContext: Context<ContextProps> = React.createContext({
    hasLoaded: false,
    client: undefined,
    sessionToken: undefined,
})

export function createClient(sessionToken: ?string) {
    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        auth: sessionToken == null ? {} : {
            sessionToken,
        },
        autoConnect: true,
        autoDisconnect: false,
        verifySignatures: 'never',
    })
}

const CustomContextProvider = ({ sessionToken, hasLoaded, children }) => {
    const client = useClient()

    const value = useMemo(() => ({
        client,
        hasLoaded,
        sessionToken,
    }), [
        client,
        hasLoaded,
        sessionToken,
    ])

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    )
}

export const ClientProvider = ({ children }: any) => {
    const sessionToken = getToken()

    const hasLoaded = useIsSessionTokenReady()

    const auth = useMemo(() => (sessionToken == null ? {} : {
        sessionToken,
    }), [sessionToken])

    return (
        <Provider
            auth={auth}
            autoConnect
            autoDisconnect={false}
            restUrl={process.env.STREAMR_API_URL}
            url={process.env.STREAMR_WS_URL}
            verifySignatures="never"
        >
            <CustomContextProvider
                hasLoaded={hasLoaded}
                sessionToken={sessionToken}
            >
                {children}
            </CustomContextProvider>
        </Provider>
    )
}

export {
    ClientProvider as Provider,
    ClientContext as Context,
}
