/**
 * Manages a subscription.
 */

/* eslint-disable react/no-unused-state */

import React, { Component, useContext } from 'react'
import uniqueId from 'lodash/uniqueId'
import t from 'prop-types'

import { ClientContext } from '$shared/components/StreamrClientContextProvider'
import { SubscriptionStatusContext } from './SubscriptionStatus'

const Message = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    Warning: 'MW',
}

class Subscription extends Component {
    static defaultProps = {
        onMessage: Function.prototype,
        onDoneMessage: Function.prototype,
        onErrorMessage: Function.prototype,
        onWarningMessage: Function.prototype,
        onNotificationMessage: Function.prototype,
        onSubscribed: Function.prototype,
        onUnsubscribed: Function.prototype,
        onResending: Function.prototype,
        onResent: Function.prototype,
        onNoResend: Function.prototype,
        onError: Function.prototype,
    }

    static propTypes = {
        onMessage: t.func.isRequired,
        onDoneMessage: t.func.isRequired,
        onErrorMessage: t.func.isRequired,
        onWarningMessage: t.func.isRequired,
        onNotificationMessage: t.func.isRequired,
        onSubscribed: t.func.isRequired,
        onUnsubscribed: t.func.isRequired,
        onResending: t.func.isRequired,
        onResent: t.func.isRequired,
        onNoResend: t.func.isRequired,
        onError: t.func.isRequired,
    }

    uid = uniqueId('sub')

    componentDidMount() {
        if (this.props.subscriptionStatus) {
            this.props.subscriptionStatus.register(this.uid)
        }
        this.autosubscribe()
    }

    componentDidUpdate() {
        // unsubscribe if switching to active
        if (this.props.isActive && !this.isSubscribed) {
            this.autosubscribe()
        } else if (!this.props.isActive && !this.isSubscribed) {
            // unsubscribe if switching to inactive
            this.unsubscribe()
        }
    }

    componentWillUnmount() {
        this.unmounted = true
        if (this.props.subscriptionStatus) {
            this.props.subscriptionStatus.unregister(this.uid)
        }
        this.unsubscribe()
    }

    autosubscribe() {
        if (this.isSubscribed) { return }
        const { isActive, uiChannel } = this.props
        if (!this.props.clientContext.client) { return }

        if (isActive && uiChannel) {
            this.subscribe()
        }
    }

    getResendOptions() {
        const { resendFrom, resendTo, resendLast } = this.props
        if ((resendFrom == null && resendTo == null && resendLast == null) || resendLast === 0) {
            // undefined if no options
            return undefined
        }

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
        this.client = this.props.clientContext.client
        await this.client.ensureConnected()

        const { id } = uiChannel

        const resend = this.getResendOptions()
        this.subscription = this.client.subscribe(Object.assign({
            stream: id,
        }, resend ? { resend } : undefined), this.onMessage)

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
            subscription.off('unsubscribed', this.onUnsubscribed)
        }
        this.subscription = undefined
        this.client = undefined
        this.isSubscribed = false
        client.unsubscribe(subscription)
    }

    handleKnownMessageTypes = (message, ...args) => {
        switch (message.type) {
            case Message.Done: {
                this.props.onDoneMessage(message, ...args)
                break
            }
            case Message.Error: {
                this.props.onErrorMessage(message, ...args)
                break
            }
            case Message.Warning: {
                this.props.onWarningMessage(message, ...args)
                break
            }
            case Message.Notification: {
                this.props.onNotificationMessage(message, ...args)
                break
            }
            default: // continue
        }
    }

    onMessage = (message, ...args) => {
        if (!this.isSubscribed) { return }
        this.handleKnownMessageTypes(message, ...args)
        this.props.onMessage(message, ...args)
    }

    /**
     * Wrap prop event handlers so they can be cleaned up in unsubscribe
     */

    onSubscribed = (...args) => {
        if (this.props.subscriptionStatus) {
            this.props.subscriptionStatus.subscribed(this.uid)
        }
        this.props.onSubscribed(...args)
    }

    onUnsubscribed = (...args) => {
        if (this.props.subscriptionStatus) {
            this.props.subscriptionStatus.unsubscribed(this.uid)
        }
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

export default React.forwardRef((props, ref) => {
    const subscriptionStatus = useContext(SubscriptionStatusContext)
    const clientContext = useContext(ClientContext)
    const { uiChannel, resendAll } = props
    // create new subscription if uiChannel or resendAll changes
    const subscriptionKey = (uiChannel && uiChannel.id) + resendAll

    if (!clientContext) {
        console.warn('Missing clientContext.')
        return null
    }

    return (
        <Subscription
            {...props}
            ref={ref}
            key={subscriptionKey}
            subscriptionStatus={subscriptionStatus}
            clientContext={clientContext}
        />
    )
})
