// @flow

export type Subscription = {
    bind: Function,
    unbind: Function
}

export type ModuleOptions = {
    uiResendAll?: {
        type: 'boolean',
        value: boolean
    },
    uiResendLast?: {
        type: 'number',
        value: number
    }
}

export type StreamId = string

export type SubscriptionOptions = {
    stream?: StreamId,
    apiKey?: string,
    partition?: number,
    resend_all?: boolean, // TODO: Update these to new streamr client spec
    resend_last?: number,
    resend_from?: number,
    resend_from_time?: number | Date,
    resend_to?: number
}

type Callback = (e: ?Event) => void
type ClientEvent = 'subscribed' | 'unsubscribed'

export type StreamrClient = {
    connect: () => void,
    disconnect: () => void,
    pause: () => void,
    subscribe: (SubscriptionOptions, Function) => Subscription,
    unsubscribe: () => void,
    unsubscribeAll: () => void,
    getSubscriptions: () => void,
    bind: (event: ClientEvent, callback: Callback) => void,
    unbind: (event: ClientEvent, callback: Callback) => void
}
