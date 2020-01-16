// @flow

import React, { Component } from 'react'
import _ from 'lodash'

import type { Node } from 'react'

import * as api from '$shared/utils/api'
import type { StreamId, Subscription, ModuleOptions, SubscriptionOptions } from '../../../flowtype/streamr-client-types'

import { Consumer } from '../../StreamrClientProvider'
import type { StreamrClient } from '../../StreamrClientProvider'

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function,
    children?: Node,
    onMessage?: ?(any) => void,
    onSubscribed?: (opt: ?{
        from?: number
    }) => void,
    onUnsubscribed?: () => void,
    onResending?: () => void,
    onResent?: () => void,
    onNoResend?: () => void,
    onModuleJson?: ?(json: {
        options: ModuleOptions
    }) => void
}

export default class StreamrWidget extends Component<Props> {
    componentDidMount() {
        if (this.client) {
            this.setup()
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.subscriptionOptions !== undefined && !_.isEqual(this.props.subscriptionOptions, newProps.subscriptionOptions)) {
            console.warn('Updating stream subscriptionOptions on the fly is not (yet) possible')
        }

        if (this.client) {
            this.setup()
        }
    }

    componentWillUnmount() {
        if (this.subscription && this.client) {
            this.client.unsubscribe(this.subscription)
            this.subscription = undefined
        }
    }

    onMessage = (msg: {}) => {
        if (this.props.onMessage) {
            this.props.onMessage(msg)
        }
    }

    getHeaders = () => (this.client.options.auth.apiKey ? {
        Authorization: `Token ${this.client.options.auth.apiKey}`,
    } : {})

    setup() {
        if (this.alreadyFetchedAndSubscribed) {
            return
        }
        this.alreadyFetchedAndSubscribed = true
        const safeBind = (sub: ?Subscription, event: string, callback: ?Function) => {
            if (sub && callback && event) {
                sub.bind(event, callback)
            }
        }
        const {
            subscriptionOptions = {}, onSubscribed, onUnsubscribed, onResending, onResent, onNoResend,
        } = this.props
        this.getModuleJson((json: {
            uiChannel?: {
                id: string
            },
            options: ModuleOptions
        }) => {
            if (this.props.onModuleJson) {
                this.props.onModuleJson(json)
            }

            const options = json.options || {}
            if (!subscriptionOptions.stream) {
                this.stream = json.uiChannel ? json.uiChannel.id : null
            }
            if (this.stream && !this.subscription) {
                this.subscription = this.client.subscribe({
                    stream: this.stream,
                    apiKey: subscriptionOptions.apiKey,
                    partition: subscriptionOptions.partition,
                    resend_all: !!(subscriptionOptions.resend_all || (options.uiResendAll && options.uiResendAll.value)),
                    resend_last: subscriptionOptions.resend_last || (options.uiResendLast && options.uiResendLast.value),
                    resend_from: subscriptionOptions.resend_from,
                    resend_from_time: subscriptionOptions.resend_from_time,
                    resend_to: subscriptionOptions.resend_to,
                }, this.onMessage)
                safeBind(this.subscription, 'subscribed', onSubscribed)
                safeBind(this.subscription, 'unsubscribed', onUnsubscribed)
                safeBind(this.subscription, 'resending', onResending)
                safeBind(this.subscription, 'resent', onResent)
                safeBind(this.subscription, 'no_resend', onNoResend)
            }
        })
    }

    getModuleJson = (callback: (any) => void) => {
        this.sendRequest({
            type: 'json',
        })
            .then((res: {
                data: {
                    json: {
                        uiChannel: {
                            id: string
                        }
                    }
                }
            }) => {
                callback(res.data.json)
            })
            .catch((res) => {
                if (this.props.onError) {
                    this.props.onError(res)
                }
            })
    }

    client: StreamrClient

    subscription: ?Subscription

    alreadyFetchedAndSubscribed: ?boolean

    stream: ?StreamId

    sendRequest = (msg: {}): Promise<any> => (
        api.post({
            url: `${this.props.url}/request`,
            data: msg,
            options: {
                headers: {
                    ...this.getHeaders(),
                },
            },
        })
    )

    render() {
        return (
            <Consumer>
                {(client) => {
                    this.client = client
                    if (!client) {
                        return null
                    }
                    return this.props.children
                }}
            </Consumer>
        )
    }
}
