// @flow

import React, { Component } from 'react'
import ComplexStreamrWidget from '../ComplexStreamrWidget'

declare var StreamrHeatmap: any

import type { ModuleOptions, StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'

type Options = ModuleOptions | {
    min: number,
    max: number,
    centerLat: number,
    centerLng: number,
    zoom: number,
    minZoom: number,
    maxZoom: number,
    radius: number,
    maxOpacity: number,
    scaleRadius: boolean,
    useLocalExtrema: boolean,
    latField: string,
    lngField: string,
    valueField: string,
    lifeTime: number,
    fadeInTime: number,
    fadeOutTime: number,
}

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function
}

export default class StreamrHeatmapComponent extends Component<Props> {
    componentWillReceiveProps(newProps: Props) {
        const changed = (key) => newProps[key] != null && newProps[key] !== this.props[key]

        if (changed('width') || changed('height')) {
            if (this.map) {
                this.map.redraw()
            }
        }
    }

    onMessage = (msg: {}) => {
        if (this.map) {
            this.map.handleMessage(msg)
        }
    }

    onResize = () => {
        if (this.map) {
            this.map.redraw()
        }
    }

    map: ?StreamrHeatmap

    renderWidget = (root: ?HTMLDivElement, options: Options) => {
        if (root) {
            this.map = new StreamrHeatmap(root, options)
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
                onResize={this.onResize}
            />
        )
    }
}
