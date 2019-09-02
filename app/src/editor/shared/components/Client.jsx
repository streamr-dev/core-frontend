/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import t from 'prop-types'
import StreamrClient from 'streamr-client'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectAuthState } from '$shared/modules/user/selectors'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import { usePending } from '$shared/hooks/usePending'

import * as services from '../services'

export const ClientContext = React.createContext()

export function createClient(apiKey) {
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

function useClientProvider({
    apiKey,
    loadKeys,
    isAuthenticating,
    isAuthenticated,
    authenticationFailed,
}) {
    const [client, setClient] = useState()
    const isMountedRef = useIsMountedRef()
    const hasClient = !!client
    const loadKeyPending = usePending('client.key')
    const [hasLoaded, setHasLoaded] = useState(!!apiKey)
    const endLoad = useCallback(() => {
        if (!isMountedRef.current) { return }
        setHasLoaded(true)
    }, [isMountedRef])

    useEffect(() => {
        if ((isAuthenticating || !isAuthenticated) && !authenticationFailed) { return } // do nothing if waiting to auth
        if (hasLoaded || loadKeyPending.isPending) { return }
        loadKeyPending.wrap(() => (
            loadKeys().then(endLoad, (error) => {
                endLoad()
                if (!isMountedRef.current) { return }
                throw error
            })
        ))
    }, [loadKeys, loadKeyPending, hasLoaded, endLoad, isMountedRef, authenticationFailed, isAuthenticated, isAuthenticating])

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
        if (!client) { return }
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
        if (!client) { return }
        return () => {
            client.ensureDisconnected()
        }
    }, [client, setClient])

    const send = useCallback(async (rest) => (
        services.send({
            apiKey,
            ...rest,
        })
    ), [apiKey])

    return useMemo(() => ({
        hasLoaded,
        client,
        send,
    }), [client, send, hasLoaded])
}

export function ClientProviderComponent({ children, ...props }) {
    const clientContext = useClientProvider(props)
    return (
        <ClientContext.Provider value={clientContext}>
            {children || null}
        </ClientContext.Provider>
    )
}

ClientProviderComponent.propTypes = {
    apiKey: t.string,
}

const withAuthApiKey = connect((state) => ({
    apiKey: selectAuthApiKeyId(state),
}), {
    loadKeys: getMyResourceKeys,
})

export const ClientProvider = withAuthApiKey(connect(selectAuthState)(ClientProviderComponent))
