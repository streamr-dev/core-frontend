import React, { Component } from 'react'
import { connect } from 'react-redux'
import t from 'prop-types'
import StreamrClient from 'streamr-client'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'

const MessageTypes = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    ModuleWarning: 'MW',
}

const ClientContext = React.createContext()

class ClientProvider extends Component {
    static propTypes = {
        authKey: t.string,
    }

    state = {
        client: undefined,
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
        if (client) {
            client.disconnect()
        }
    }

    render() {
        return (
            <ClientContext.Provider value={this.state}>
                {this.props.children || null}
            </ClientContext.Provider>
        )
    }
}

class Subscription extends Component {
    static contextType = ClientContext

    static defaultProps = {
        onMessage: Function.prototype,
        onSubscribed: Function.prototype,
        onUnsubscribed: Function.prototype,
        onResending: Function.prototype,
        onResent: Function.prototype,
        onNoResend: Function.prototype,
    }

    static propTypes = {
        onMessage: t.func.isRequired,
        onSubscribed: t.func.isRequired,
        onUnsubscribed: t.func.isRequired,
        onResending: t.func.isRequired,
        onResent: t.func.isRequired,
        onNoResend: t.func.isRequired,
    }

    componentDidMount() {
        this.autosubscribe()
    }

    componentDidUpdate() {
        this.autosubscribe()
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    autosubscribe() {
        if (this.isSubscribed) { return }
        const { isActive, uiChannel } = this.props
        if (!this.context.client) { return }
        if (isActive && uiChannel) {
            this.subscribe()
        } else {
            this.unsubscribe()
        }
    }

    subscribe() {
        const {
            uiChannel,
            resendAll,
            resendFrom,
            resendFromTime,
            resendLast,
        } = this.props

        this.unsubscribe()

        this.isSubscribed = true
        this.client = this.context.client

        const { id } = uiChannel
        this.subscription = this.client.subscribe({
            stream: id,
            resend_all: resendAll != null ? !!resendAll : undefined,
            resend_last: (!resendAll && resendLast != null) ? resendLast : undefined,
            resend_from: (!resendAll && resendFrom != null) ? resendFrom : undefined,
            resend_from_time: (!resendAll && resendFromTime != null) ? resendFromTime : undefined,
        }, this.onMessage)
    }

    unsubscribe() {
        if (!this.isSubscribed) { return }
        const { client, subscription } = this
        if (subscription) {
            subscription.off('subscribed', this.onSubscribed)
            subscription.off('unsubscribed', this.onUnsubscribed)
            subscription.off('resending', this.onResending)
            subscription.off('resent', this.onResent)
            subscription.off('no_resend', this.onNoResend)
        }
        this.subscription = undefined
        this.client = undefined
        this.isSubscribed = false
        client.unsubscribe(subscription)
        this.props.onUnsubscribed()
    }

    onMessage = (message, ...args) => {
        if (!this.isSubscribed) { return }

        this.props.onMessage(message, ...args)

        if (message.type === MessageTypes.Done) {
            // unsubscribe when done
            this.unsubscribe()
        }
    }

    onSubscribed = (...args) => {
        this.props.onSubscribed(...args)
    }

    onUnsubscribed = (...args) => {
        this.props.onUnsubscribed(...args)
    }

    onResending = (...args) => {
        this.props.onResending(...args)
    }

    onResent = (...args) => {
        this.props.onResent(...args)
    }

    onNoResend = (...args) => {
        this.props.onNoResend(...args)
    }

    render() {
        return this.props.children || null
    }
}

export default (props) => {
    const { uiChannel, resendAll } = props
    // create new subscription if uiChannel or resendAll changes
    const subscriptionKey = (uiChannel && uiChannel.id) + resendAll
    return (
        <Subscription key={subscriptionKey} {...props} />
    )
}

const withAuthKey = connect((state) => ({
    authKey: selectAuthApiKeyId(state),
}))

export const Provider = withAuthKey((props) => (
    // new client if authKey changes
    <ClientProvider key={props.authKey} {...props} />
))
