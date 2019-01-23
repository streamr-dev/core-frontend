import React, { Component } from 'react'
import { connect } from 'react-redux'

import StreamrClient from 'streamr-client'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'

const MessageTypes = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    ModuleWarning: 'MW',
}

class Subscription extends Component {
    static defaultProps = {
        onMessage: Function.prototype,
        onUnsubscribe: Function.prototype,
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
        if (isActive && uiChannel) {
            this.subscribe()
        } else {
            this.unsubscribe()
        }
    }

    subscribe() {
        const {
            uiChannel,
            authKey,
            resendAll,
            resendFrom,
            resendFromTime,
            resendLast,
        } = this.props

        this.unsubscribe()
        this.isSubscribed = true

        const { id } = uiChannel
        this.client = new StreamrClient({
            url: process.env.STREAMR_WS_URL,
            auth: {
                apiKey: authKey,
            },
            autoConnect: true,
            autoDisconnect: true,
        })

        this.subscription = this.client.subscribe({
            stream: id,
            resend_all: resendAll != null ? !!resendAll : undefined,
            resend_last: resendLast != null ? resendLast : undefined,
            resend_from: resendFrom != null ? resendFrom : undefined,
            resend_from_time: resendFromTime != null ? resendFromTime : undefined,
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
        client.disconnect()
        this.props.onUnsubscribe()
    }

    onMessage = (message, ...args) => {
        if (!this.isSubscribed) { return }

        if (this.props.onMessage) {
            this.props.onMessage(message, ...args)
        }

        if (message.type === MessageTypes.Done) {
            // unsubscribe when done
            this.unsubscribe()
        }
    }

    onSubscribed = (...args) => {
        if (this.props.onSubscribed) {
            this.props.onSubscribed(...args)
        }
    }

    onUnsubscribed = (...args) => {
        if (this.props.onUnsubscribed) {
            this.props.onUnsubscribed(...args)
        }
    }

    onResending = (...args) => {
        if (this.props.onResending) {
            this.props.onResending(...args)
        }
    }

    onResent = (...args) => {
        if (this.props.onResent) {
            this.props.onResent(...args)
        }
    }

    onNoResend = (...args) => {
        if (this.props.onNoResend) {
            this.props.onNoResend(...args)
        }
    }

    render() {
        return this.props.children || null
    }
}

const mapStateToProps = (state) => ({
    authKey: selectAuthApiKeyId(state),
})

export const withAuthKey = connect(mapStateToProps)

export default withAuthKey((props) => {
    if (!props.authKey) { return null } // wait for authKey
    // create new subscription if uiChannel or resendAll changes
    const key = props.authKey + (props.uiChannel && props.uiChannel.id) + props.resendAll
    return (
        <Subscription key={key} {...props} />
    )
})
