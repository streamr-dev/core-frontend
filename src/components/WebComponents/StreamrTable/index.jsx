// @flow

import React, { Component } from 'react'
import ComplexStreamrWidget from '../ComplexStreamrWidget'

declare var StreamrTable: Function

import type { ModuleOptions, StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'

type Options = ModuleOptions | {}

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function
}

export default class StreamrTableComponent extends Component<Props> {
    onMessage = (msg: {}) => {
        if (this.table) {
            this.table.receiveResponse(msg)
        }
    }

    table: ?StreamrTable

    renderWidget = (root: ?HTMLDivElement, options: Options) => {
        if (root) {
            this.table = new StreamrTable(root, options)
            this.table.initTable()
        }
    }

    render() {
        return (
            <ComplexStreamrWidget
                stream={this.props.stream}
                url={this.props.url}
                onError={this.props.onError}
                width={this.props.width}
                height={this.props.height}
                onMessage={this.onMessage}
                renderWidget={this.renderWidget}
            />
        )
    }
}
