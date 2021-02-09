/* eslint-disable react/no-unused-state */

import React, { useContext, useCallback, useEffect, useMemo, useRef } from 'react'
import { useSubscription } from 'streamr-client-react'
import * as SubscriptionStatus from '$shared/contexts/SubscriptionStatus'
import { Message } from '$shared/utils/SubscriptionEvents'
import useUniqueId from '$shared/hooks/useUniqueId'
import * as services from '$editor/shared/services'

function getResendOptions({ resendFrom, resendTo, resendLast } = {}) {
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

function useStatusSubscription(subOptions = {}, options = {}) {
    const { onMessage: onMessageFn } = options
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const { register, unregister, subscribed, unsubscribed } = subscriptionStatus || {}
    const uid = useUniqueId('useStatusSubscription')
    const onSubscribed = useCallback(() => {
        if (subscribed) {
            subscribed(uid)
        }
    }, [uid, subscribed])

    const onUnsubscribed = useCallback(() => {
        if (unsubscribed) {
            unsubscribed(uid)
        }
    }, [uid, unsubscribed])
    const onMessage = useCallback((...args) => {
        if (subscribed) {
            subscribed(uid)
        }
        onMessageFn(...args)
    }, [uid, subscribed, onMessageFn])

    const opts = useMemo(() => ({
        ...options,
        onMessage,
        onSubscribed,
        onUnsubscribed,
    }), [options, onSubscribed, onUnsubscribed, onMessage])

    useSubscription(subOptions, opts)

    useEffect(() => {
        if (!register) { return }
        register(uid)
        return () => {
            unregister(uid)
        }
    }, [uid, register, unregister])
}

const noop = () => {}

function useKnownMessageHandler({ onDoneMessage = noop, onWarningMessage = noop, onErrorMessage = noop, onMessage = noop } = {}) {
    const handlers = useRef({})
    useEffect(() => {
        handlers.current = {
            onDoneMessage, onWarningMessage, onErrorMessage, onMessage,
        }
    }, [onDoneMessage, onWarningMessage, onErrorMessage, onMessage])
    return useCallback((msg, ...args) => {
        const { onDoneMessage = noop, onWarningMessage = noop, onErrorMessage = noop, onMessage = noop } = handlers.current
        switch (msg.type) {
            case Message.Done: {
                onDoneMessage(msg, ...args)
                break
            }
            case Message.Warning: {
                onWarningMessage(msg, ...args)
                break
            }
            case Message.Error: {
                onErrorMessage(msg, ...args)
                break
            }
            default: {
                onMessage(msg, ...args)
            }
        }
    }, [])
}

function useCanvasSubscription({ uiChannel = {}, isActive = false, isRealtime, ...options } = {}) {
    const resend = getResendOptions(options)
    const onMessage = useKnownMessageHandler(options)

    return useStatusSubscription({
        stream: uiChannel.id,
        partition: uiChannel.partition,
        resend,
    }, {
        isActive,
        onMessage,
        isRealtime,
    })
}

function useModuleSubscription({ module = {}, isSubscriptionActive, ...props } = {}) {
    const { uiChannel = {}, options = {} } = module
    const resend = getResendOptions({
        resendLast: options.uiResendLast && options.uiResendLast.value,
        resendFrom: options.uiResendFrom && options.uiResendFrom.value,
        resendTo: options.resendTo && options.resendTo.value,
        resendFromTime: options.uiResendFromTime && options.uiResendFromTime.value,
    })

    const onMessage = useKnownMessageHandler(props)

    return useStatusSubscription({
        stream: uiChannel.id,
        partition: uiChannel.partition,
        resend,
    }, {
        isActive: !!isSubscriptionActive,
        onMessage,
    })
}

export function Subscription(props) {
    useCanvasSubscription(props)
    return null
}

function ModuleSubscriptionHook(props) {
    useModuleSubscription(props)
    return null
}

export default class ModuleSubscription extends React.PureComponent {
    // This method is intended to be exposed through a ref. Example usage:
    //
    // this.subscription = React.createRef()
    // ...
    // <ModuleSubscription
    //    ...
    //    ref={this.subscription}
    // />
    //
    // Because `ModuleSubscription` is a component, the `ref` will be a `ModuleSubscription` instance,
    // rather than a dom node. Then the value of the `ref.current` is the same object as the `this`
    // inside a `ModuleSubscription` component method because `send` is a method of `ModuleSubscription`,
    // you can call the `send` method via the ref.
    send = async (data) => {
        if (this.unmounted) { return }
        if (!this.props.isActive) { return } // do nothing if not active
        const { canvasId, dashboardId, moduleHash } = this.props
        return services.send({
            data,
            canvasId,
            dashboardId,
            moduleHash,
        })
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            // always load when switching from inactive to active
            this.load()
            if (this.props.onActiveChange) {
                return this.props.onActiveChange(true)
            }
        }

        if (prevProps.isActive && !this.props.isActive) {
            if (this.props.onActiveChange) {
                return this.props.onActiveChange(false)
            }
        }
    }

    async load() {
        if (this.props.isActive && this.props.loadOptions) {
            let res
            try {
                res = await this.send(this.props.loadOptions)
                if (this.unmounted) { return }
            } catch (error) {
                if (this.unmounted) { return }
                if (this.props.onError) {
                    return this.props.onError(error)
                }
                throw error
            }
            if (this.props.onLoad) {
                return this.props.onLoad(res)
            }
        }
    }

    componentDidMount() {
        this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    render() {
        return <ModuleSubscriptionHook {...this.props} />
    }
}
