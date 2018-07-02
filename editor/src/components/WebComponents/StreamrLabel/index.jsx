// @flow

import React, { Component } from 'react'
import StreamrWidget from '../StreamrWidget'

import type { StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'
import styles from './streamr-label.pcss'

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function,
    style: {}
}

type State = {
    value: number | string
}

export default class StreamrLabel extends Component<Props, State> {
    static defaultProps = {
        style: {},
    }

    state = {
        value: '',
    }

    onMessage = ({ value }: { value: number | string }) => {
        if (this.widget) {
            this.setState({
                value,
            })
        }
    }

    widget: ?StreamrWidget

    render() {
        return (
            <StreamrWidget
                subscriptionOptions={{
                    stream: this.props.stream,
                    resend_last: 1,
                }}
                url={this.props.url}
                onMessage={this.onMessage}
                onError={this.props.onError}
                ref={(w) => { this.widget = w }}
            >
                <span
                    className={styles.label}
                    style={{
                        ...this.props.style,
                    }}
                >
                    {this.state.value}
                </span>
            </StreamrWidget>
        )
    }
}
