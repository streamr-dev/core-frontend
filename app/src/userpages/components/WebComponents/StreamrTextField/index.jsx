// @flow

import React, { Component } from 'react'
import { Button, Input } from 'reactstrap'
import StreamrInput from '../StreamrInput'
import StreamrWidget from '../StreamrWidget'

import type { StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'
import styles from './streamrTextField.pcss'

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function
}

type State = {
    value: string
}

export default class StreamrTextField extends Component<Props, State> {
    state = {
        value: '',
    }

    onMessage = ({ state: textFieldValue }: { state: string }) => {
        if (this.widget) {
            if (textFieldValue) {
                this.setState({
                    value: textFieldValue,
                })
            }
        }
    }

    onClick = () => {
        if (this.widget) {
            this.widget.sendRequest({
                type: 'uiEvent',
                value: this.state.value,
            })
        }
    }

    onChange = (e: {
        preventDefault: () => void,
        target: {
            value: string
        }
    }) => {
        e.preventDefault()
        this.setState({
            value: e.target.value,
        })
    }

    widget: ?StreamrWidget

    widgetRef = (widget: ?StreamrWidget) => {
        this.widget = widget
    }

    render() {
        return (
            <StreamrInput
                {...this.props}
                onMessage={this.onMessage}
                widgetRef={this.widgetRef}
            >
                <div className={styles.streamrTextField}>
                    <div className={styles.textareaContainer}>
                        <Input
                            type="textarea"
                            placeholder="Message"
                            value={this.state.value}
                            onChange={this.onChange}
                            className={styles.textarea}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button
                            onClick={this.onClick}
                            color="primary"
                            size="lg"
                            className={styles.button}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </StreamrInput>
        )
    }
}
