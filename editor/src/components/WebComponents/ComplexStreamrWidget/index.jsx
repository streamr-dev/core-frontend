// @flow

import React, { Component } from 'react'
import _ from 'lodash'
import StreamrWidget from '../StreamrWidget'

import type { ModuleOptions, StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'
import styles from './complexStreamrWidget.pcss'

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function,
    renderWidget: (root: ?HTMLDivElement, ModuleOptions) => void,
    onMessage: (any) => void,
    className: string,
    onResize?: (width: ?number, height: ?number) => void
}

type State = {
    options: ModuleOptions
}

export default class ComplexStreamrWidget extends Component<Props, State> {
    static defaultProps = {
        className: '',
    }

    state = {
        options: {},
    }

    componentWillReceiveProps(newProps: Props) {
        const changed = (key) => newProps[key] != null && newProps[key] !== this.props[key]

        if (changed('width') || changed('height')) {
            if (this.props.onResize) {
                this.props.onResize(newProps.width, newProps.height)
            }
        }
    }

    onModuleJson = ({ options }: { options: ModuleOptions }) => {
        const opt = _.mapValues(options, 'value')
        if (this.root) {
            this.setState({
                options: {
                    ...this.state.options,
                    ...(opt || {}),
                },
            })
            this.props.renderWidget(this.root, opt)
        }
    }

    root: ?HTMLDivElement
    widget: ?StreamrWidget

    render() {
        return (
            <StreamrWidget
                subscriptionOptions={{
                    stream: this.props.stream,
                }}
                onModuleJson={this.onModuleJson}
                url={this.props.url}
                onMessage={this.props.onMessage}
                onError={this.props.onError}
                ref={(w) => { this.widget = w }}
            >
                <div
                    ref={(root) => { this.root = root }}
                    className={`${styles.root} ${this.props.className}`}
                />
            </StreamrWidget>
        )
    }
}
