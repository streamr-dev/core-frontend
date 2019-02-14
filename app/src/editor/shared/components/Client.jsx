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

class ClientProviderComponent extends Component {
    static propTypes = {
        authKey: t.string,
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

    setup() {
        const { authKey } = this.props
        if (!authKey || this.state.client) { return }
        this.setState({
            client: new StreamrClient({
                url: process.env.STREAMR_WS_URL,
                authKey,
                autoConnect: true,
                autoDisconnect: true,
            }),
        })
    }

    teardown() {
        const { client } = this.state
        if (client && client.connection) {
            client.disconnect()
        }
    }

    send = async (rest) => (
        services.send({
            authKey: this.props.authKey,
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

export const withAuthKey = connect((state) => ({
    authKey: selectAuthApiKeyId(state),
}), {
    loadKeys: getMyResourceKeys,
})

export const ClientProvider = withAuthKey(class ClientProvider extends React.Component {
    state = {
        isLoading: false,
    }

    async loadIfNoKey() {
        if (this.state.isLoading || this.props.authKey) { return }
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
        if (!props.authKey) { return null }
        // new client if authKey changes
        return (
            <ClientProviderComponent key={props.authKey} {...props} />
        )
    }
})
