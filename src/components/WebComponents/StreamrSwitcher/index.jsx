// @flow

import React, { Component } from 'react'
import StreamrInput from '../StreamrInput'

import type { StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'
import styles from './streamrSwitcher.pcss'

type State = {
    value: boolean
}

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function
}

export default class StreamrSwitcher extends Component<Props, State> {
    state = {
        value: false,
    }

    onModuleJson = ({ switcherValue }: { switcherValue: boolean }) => {
        if (this.input) {
            this.setState({
                value: switcherValue,
            })
        }
    }

    onClick = () => {
        const newValue = !this.state.value
        this.setState({
            value: newValue,
        })

        if (this.input) {
            this.input.sendValue(newValue)
        }
    }

    input: ?StreamrInput

    render() {
        return (
            <StreamrInput
                {...this.props}
                onModuleJson={this.onModuleJson}
                ref={(input) => { this.input = input }}
            >
                <div className={styles.streamrSwitcher}>
                    <a
                        className={`${styles.switcher} ${this.state.value ? styles.on : styles.off}`}
                        onClick={this.onClick}
                        href="#"
                    >
                        <div className={styles.switcherInner} />
                    </a>
                </div>
            </StreamrInput>
        )
    }
}
