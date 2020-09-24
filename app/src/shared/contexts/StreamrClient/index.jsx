// @flow

/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { type Node, type Context, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import StreamrClient from 'streamr-client'
import { getToken } from '$shared/utils/sessionToken'

import { selectAuthState } from '$shared/modules/user/selectors'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'

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

type ClientProviderProps = {
    sessionToken: ?string,
    isAuthenticating: boolean,
    authenticationFailed: boolean,
}

function useClientProvider({ isAuthenticating, authenticationFailed }: ClientProviderProps) {
    const [client, setClient] = useState()
    const isMountedRef = useIsMountedRef()
    const hasClient = !!client
    const sessionToken = getToken()
    const hasLoaded = !!sessionToken || !!(!isAuthenticating && authenticationFailed)

    const reset = useCallback(() => {
        if (!client) { return }
        // clean up listeners
        client.connection.off('disconnecting', reset)
        client.connection.off('disconnected', reset)
        client.off('error', reset)
        if (!isMountedRef.current) { return }
        // reset client unless already changed
        setClient((currentClient) => {
            if (currentClient !== client) { return currentClient }
            return undefined
        })
    }, [client, setClient, isMountedRef])

    // listen for state changes which should trigger reset
    useEffect(() => {
        if (!client) { return () => {} }
        client.connection.once('disconnecting', reset)
        client.connection.once('disconnected', reset)
        client.once('error', reset)
        return reset // reset to cleanup
    }, [reset, client, sessionToken])

    // (re)create client if none
    useLayoutEffect(() => {
        if (hasClient || !hasLoaded) { return }
        setClient(createClient(sessionToken))
    }, [hasClient, setClient, sessionToken, hasLoaded])

    // disconnect on unmount/client change
    useEffect(() => {
        if (!client) { return () => {} }
        return () => {
            client.ensureDisconnected()
        }
    }, [client, setClient])

    return useMemo(() => ({
        hasLoaded,
        client,
        sessionToken,
    }), [client, sessionToken, hasLoaded])
}

type Props = ClientProviderProps & {
    children?: Node,
}

export function ClientProviderComponent({ children, ...props }: Props) {
    const clientContext = useClientProvider(props)
    return (
        <ClientContext.Provider value={clientContext}>
            {children || null}
        </ClientContext.Provider>
    )
}

const mapStateToProps = (state) => ({
    ...selectAuthState(state),
})

export const ClientProvider = connect(mapStateToProps)(ClientProviderComponent)

export {
    ClientProvider as Provider,
    ClientContext as Context,
}
