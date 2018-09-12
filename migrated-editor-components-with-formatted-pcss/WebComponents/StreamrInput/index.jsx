// @flow

import React, { Component } from 'react'
import type { Node } from 'react'
import StreamrWidget from '../StreamrWidget'

import type { StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function,
    onMessage?: ?({ state: string }) => void,
    onModuleJson?: ?Function,
    children: Node,
    widgetRef?: (widget: ?StreamrWidget) => void
}

export default class StreamrInput extends Component<Props> {
    componentDidMount = () => {
        if (this.widget) {
            this.widget.sendRequest({
                type: 'getState',
            })
                .then(({ data }) => {
                    if (this.props.onMessage) {
                        this.props.onMessage(data)
                    }
                })
        }
    }

    widget: ?StreamrWidget

    sendValue = (value: ?any) => {
        if (this.widget) {
            this.widget.sendRequest({
                type: 'uiEvent',
                value,
            })
        }
    }

    render() {
        return (
            <StreamrWidget
                subscriptionOptions={{
                    stream: this.props.stream,
                    resend_last: 1,
                }}
                url={this.props.url}
                onError={this.props.onError}
                onMessage={this.props.onMessage}
                onModuleJson={this.props.onModuleJson}
                ref={(widget) => {
                    this.widget = widget
                    if (this.props.widgetRef) {
                        this.props.widgetRef(widget)
                    }
                }}
            >
                {React.Children.only(this.props.children)}
            </StreamrWidget>
        )
    }
}
