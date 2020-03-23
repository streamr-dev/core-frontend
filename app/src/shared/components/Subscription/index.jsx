// @flow

/**
 * Manages a subscription.
 */

import React, { type Node, Component, useContext, type ComponentType } from 'react'
import uniqueId from 'lodash/uniqueId'

import { Context as ClientContext, type ContextProps as ClientContextProps } from '$shared/contexts/StreamrClient'
import type { StreamId } from '$shared/flowtype/stream-types'

import { SubscriptionStatusContext } from '$shared/contexts/SubscriptionStatus'

const Message = {
    Done: 'D',
    Error: 'E',
    Notification: 'N',
    Warning: 'MW',
}

type SubscriptionStatus = {
    register: Function,
    unregister: Function,
    subscribed: Function,
    unsubscribed: Function,
}

type Props = {
    onMessage: Function,
    onDoneMessage: Function,
    onErrorMessage: Function,
    onWarningMessage: Function,
    onNotificationMessage: Function,
    onSubscribed: Function,
    onUnsubscribed: Function,
    onResending: Function,
    onResent: Function,
    onNoResend: Function,
    onError: Function,
    subscriptionStatus?: SubscriptionStatus,
    isActive?: boolean,
    uiChannel: { id: StreamId },
    clientContext: ClientContextProps,
    resendFrom: number,
    resendTo: number,
    resendLast: number,
    children?: Node,
}

class Subscription extends Component<Props> {
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

    componentDidMount() {
        if (this.props.subscriptionStatus && this.props.subscriptionStatus.register) {
            this.props.subscriptionStatus.register(this.uid)
        }
        this.autosubscribe()
    }

    componentDidUpdate() {
        // unsubscribe if switching to active
        if (this.props.isActive && !this.isSubscribed) {
            this.autosubscribe()
        } else if (!this.props.isActive && this.isSubscribed) {
            // unsubscribe if switching to inactive
            this.unsubscribe()
        }
    }

    componentWillUnmount() {
        this.unmounted = true
        if (this.props.subscriptionStatus && this.props.subscriptionStatus.unregister) {
            this.props.subscriptionStatus.unregister(this.uid)
        }
        this.unsubscribe()
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
        if (this.props.subscriptionStatus && this.props.subscriptionStatus.subscribed) {
            this.props.subscriptionStatus.subscribed(this.uid)
        }
        this.props.onSubscribed(...args)
    }

    onUnsubscribed = (...args) => {
        if (this.props.subscriptionStatus && this.props.subscriptionStatus.unsubscribed) {
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

    unmounted: boolean = false
    isSubscribed: boolean = false
    subscription: any = undefined

    autosubscribe() {
        if (this.isSubscribed) { return }
        const { isActive, uiChannel } = this.props
        if (!this.props.clientContext.client) { return }

        if (isActive && uiChannel && uiChannel.id) {
            this.subscribe()
        }
    }

    uid = uniqueId('sub')

    async subscribe() {
        const { uiChannel } = this.props

        this.unsubscribe()

        this.isSubscribed = true
        const { client } = this.props.clientContext
        await client.ensureConnected()

        const { id } = uiChannel

        const resend = this.getResendOptions()

        const options = {
            stream: id,
            resend,
        }

        if (!resend) {
            delete options.resend
        }

        this.subscription = client.subscribe(options, this.onMessage)

        this.subscription.on('subscribed', this.onSubscribed)
        this.subscription.on('unsubscribed', this.onUnsubscribed)
        this.subscription.on('resending', this.onResending)
        this.subscription.on('resent', this.onResent)
        this.subscription.on('no_resend', this.onNoResend)
        this.subscription.on('error', this.onError)
    }

    unsubscribe() {
        if (!this.isSubscribed) { return }
        const { subscription } = this
        const { client } = this.props.clientContext
        if (subscription) {
            subscription.off('subscribed', this.onSubscribed)
            subscription.off('resending', this.onResending)
            subscription.off('resent', this.onResent)
            subscription.off('no_resend', this.onNoResend)
            subscription.off('error', this.onError)
        }
        this.subscription = undefined
        this.isSubscribed = false
        subscription.once('unsubscribed', () => {
            subscription.off('unsubscribed', this.onSubscribed)
        })
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

    render() {
        return this.props.children || null
    }
}

type OuterProps = {
    // Deprecated?
    resendAll?: any,
}

export default (React.forwardRef(({ resendAll, ...rest }: OuterProps, ref) => {
    const subscriptionStatus = useContext(SubscriptionStatusContext)
    const clientContext = useContext(ClientContext)
    const props: Props = (rest: any)
    const { uiChannel } = props
    // create new subscription if uiChannel or resendAll changes
    const subscriptionKey = (uiChannel && uiChannel.id) + (resendAll || '')

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
}): ComponentType<OuterProps>)
