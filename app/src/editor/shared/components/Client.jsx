/**
 * Provides a shared streamr-client instance.
 */

/* eslint-disable react/no-unused-state */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import t from 'prop-types'
import StreamrClient from 'streamr-client'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'

import * as services from '../services'

export const ClientContext = React.createContext()

export function createClient(apiKey) {
    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        auth: {
            apiKey, // assume this won't change for now
        },
        autoConnect: true,
        autoDisconnect: false,
    })
}

export class ClientProviderComponent extends Component {
    static propTypes = {
        apiKey: t.string,
    }

    componentDidMount() {
        this.setup()
    }

    componentDidUpdate() {
        this.setup()
    }

    componentWillUnmount() {
        this.teardown()
    }

    forceSetup = () => this.setup(true)

    setup(forceCreate) {
        const { apiKey } = this.props
        let { client } = this.state
        if (!forceCreate) {
            if (!apiKey) { return }
            if (client) {
                client.ensureConnected()
                return
            }
        }

        client = createClient(apiKey)
        client.once('disconnecting', this.forceSetup)

        this.setState({
            client,
        })
    }

    disconnect() {
        const { client } = this.state
        if (!client) { return }
        client.off('disconnecting', this.forceSetup)
        return client.ensureDisconnected()
    }

    teardown() {
        this.disconnect()
    }

    send = async (rest) => (
        services.send({
            apiKey: this.props.apiKey,
            ...rest,
        })
    )

    state = {
        client: undefined,
        send: this.send,
    }

    render() {
        return (
            <ClientContext.Provider value={this.state}>
                {this.props.children || null}
            </ClientContext.Provider>
        )
    }
}

const withAuthApiKey = connect((state) => ({
    apiKey: selectAuthApiKeyId(state),
}), {
    loadKeys: getMyResourceKeys,
})

export const ClientProvider = withAuthApiKey(class ClientProvider extends React.Component {
    state = {
        isLoading: false,
    }

    async loadIfNoKey() {
        if (this.state.isLoading || this.props.apiKey) { return }
        this.setState({ isLoading: true })
        try {
            await this.props.loadKeys()
        } finally {
            this.setState({ isLoading: false })
        }
    }

    componentDidUpdate() {
        return this.loadIfNoKey()
    }

    componentDidMount() {
        return this.loadIfNoKey()
    }

    render() {
        const { loadKey, ...props } = this.props
        if (!props.apiKey) { return null }
        // new client if apiKey changes
        return (
            <ClientProviderComponent key={props.apiKey} {...props} />
        )
    }
})
