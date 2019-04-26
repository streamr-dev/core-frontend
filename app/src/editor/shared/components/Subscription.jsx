/**
 * Manages a subscription.
 */

/* eslint-disable react/no-unused-state */

import React, { Component } from 'react'
import t from 'prop-types'

import { ClientContext } from './Client'

const MessageTypes = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    ModuleWarning: 'MW',
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
        resendFrom: 0,
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
        }
    }

    getResendOptions() {
        const { resendFrom, resendTo, resendLast } = this.props
        const resend = {}

        if (resendFrom != null) {
            resend.from = {
                timestamp: new Date(resendFrom).getTime(),
            }
        }

        if (resendTo != null) {
            resend.to = {
                timestamp: new Date(resendTo).getTime(),
            }
        }

        if (resendLast != null) {
            resend.last = resendLast
            delete resend.from
            delete resend.to
        }

        return resend
    }

    async subscribe() {
        const { uiChannel } = this.props

        this.unsubscribe()

        this.isSubscribed = true
        this.client = this.context.client

        const { id } = uiChannel

        this.subscription = this.client.subscribe({
            stream: id,
            resend: this.getResendOptions(),
        }, this.onMessage)

        this.subscription.on('subscribed', this.onSubscribed)
        this.subscription.on('unsubscribed', this.onUnsubscribed)
        this.subscription.on('resending', this.onResending)
        this.subscription.on('resent', this.onResent)
        this.subscription.on('no_resend', this.onNoResend)
        this.subscription.on('error', this.onError)
    }

    unsubscribe() {
        if (!this.isSubscribed) { return }
        const { client, subscription } = this
        if (subscription) {
            subscription.off('subscribed', this.onSubscribed)
            subscription.off('resending', this.onResending)
            subscription.off('resent', this.onResent)
            subscription.off('no_resend', this.onNoResend)
            subscription.off('error', this.onError)
        }
        this.subscription = undefined
        this.client = undefined
        this.isSubscribed = false
        subscription.once('unsubscribed', () => {
            subscription.off('unsubscribed', this.onUnsubscribed)
        })
        client.unsubscribe(subscription)
    }

    onMessage = (message, ...args) => {
        if (!this.isSubscribed) { return }

        this.props.onMessage(message, ...args)

        if (message.type === MessageTypes.Done) {
            // unsubscribe when done
            this.unsubscribe()
        }
    }

    /**
     * Wrap prop event handlers so they can be cleaned up in unsubscribe
     */

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

    onError = (...args) => {
        this.props.onError(...args)
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
