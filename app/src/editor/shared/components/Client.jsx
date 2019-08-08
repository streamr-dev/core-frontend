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
import useIsMountedRef from '$shared/hooks/useIsMountedRef'

import * as services from '../services'

export const ClientContext = React.createContext()

export function createClient(apiKey) {
    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        auth: apiKey == null ? {} : {
            apiKey, // assume this won't change for now
        },
        autoConnect: true,
        autoDisconnect: false,
    })
}

function useClientProvider({ apiKey }) {
    const [client, setClient] = useState()
    const isMountedRef = useIsMountedRef()
    const hasClient = !!client

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
        if (hasClient) { return }
        setClient(createClient(apiKey))
    }, [hasClient, setClient, apiKey])

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
        client,
        send,
    }), [client, send])
}

export function ClientProviderComponent({ children, apiKey }) {
    return (
        <ClientContext.Provider value={useClientProvider({ apiKey })}>
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

class ClientProviderInner extends React.Component {
    state = {
        isLoading: false,
        error: undefined,
    }

    componentDidMount() {
        this.loadIfNoKey()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    async loadIfNoKey() {
        if (this.state.isLoading || this.state.error || this.props.apiKey) { return }
        this.setState({
            isLoading: true,
            error: undefined,
        })

        let error
        try {
            await this.props.loadKeys()
        } catch (err) {
            error = err
        } finally {
            if (!this.unmounted) {
                this.setState({
                    isLoading: false,
                    error,
                })
            }
        }
    }

    render() {
        const { loadKey, ...props } = this.props
        // new client if apiKey changes
        return (
            <ClientProviderComponent {...props} />
        )
    }
}

export const ClientProvider = withAuthApiKey(({ apiKey, ...props }) => (
    <ClientProviderInner key={apiKey} apiKey={apiKey} {...props} />
))

