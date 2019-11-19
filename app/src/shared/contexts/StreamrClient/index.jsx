// @flow

/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { type Node, type Context, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import StreamrClient from 'streamr-client'

import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectAuthState } from '$shared/modules/user/selectors'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { usePending } from '$shared/hooks/usePending'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'

export type ContextProps = {
    hasLoaded: boolean,
    client: any,
    apiKey: ?ResourceKeyId,
}

export const ClientContext: Context<ContextProps> = React.createContext({
    hasLoaded: false,
    client: undefined,
    apiKey: undefined,
})

export function createClient(apiKey: ?ResourceKeyId) {
    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        auth: apiKey == null ? {} : {
            apiKey,
        },
        autoConnect: true,
        autoDisconnect: false,
    })
}

type ClientProviderProps = {
    apiKey: ?ResourceKeyId,
    loadKeys: Function,
    isAuthenticating: boolean,
    isAuthenticated: boolean,
    authenticationFailed: boolean,
}

function useClientProvider({
    apiKey,
    loadKeys,
    isAuthenticating,
    isAuthenticated,
    authenticationFailed,
}: ClientProviderProps) {
    const [client, setClient] = useState()
    const isMountedRef = useIsMountedRef()
    const hasClient = !!client
    const hasLoaded = !!apiKey || !!(!isAuthenticating && (isAuthenticated || authenticationFailed))
    const loadKeyPending = usePending('client.key')

    useEffect(() => {
        // do nothing if waiting to auth
        if (hasLoaded || loadKeyPending.isPending) { return }
        loadKeyPending.wrap(() => (
            loadKeys().catch((error) => {
                if (!isMountedRef.current) { return }
                if (error.statusCode === 401 || error.statusCode === 403) {
                    // ignore 401/403
                    return
                }

                throw error
            })
        ))
    }, [loadKeys, loadKeyPending, isMountedRef, hasLoaded])

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
    }, [reset, client, apiKey])

    // (re)create client if none
    useLayoutEffect(() => {
        if (hasClient || !hasLoaded) { return }
        setClient(createClient(apiKey))
    }, [hasClient, setClient, apiKey, hasLoaded])

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
        apiKey,
    }), [client, apiKey, hasLoaded])
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

const withAuthApiKey = connect((state) => ({
    apiKey: selectAuthApiKeyId(state),
}), {
    loadKeys: getMyResourceKeys,
})

export const ClientProvider = withAuthApiKey(connect(selectAuthState)(ClientProviderComponent))

export {
    ClientProvider as Provider,
    ClientContext as Context,
}
