// @flow

import React, { Component } from 'react'
import ComplexStreamrWidget from '../ComplexStreamrWidget'

declare var StreamrMap: Function

import type { ModuleOptions, StreamId, SubscriptionOptions } from '../../../flowtype/streamr-client-types'

type Options = ModuleOptions | {
    centerLat?: number,
    centerLng?: number,
    zoom?: number,
    minZoom?: number,
    maxZoom?: number,
    traceWidth?: number,
    drawTrace?: boolean,
    skin?: 'default' | 'cartoDark' | 'esriDark',
    directionalMarkers?: boolean,
    directionalMarkerIcon?: 'arrow' | 'arrowhead' | 'longArrow',
    markerIcon?: 'pin' | 'circle',
    customImageUrl?: string
}

type Props = {
    url: string,
    subscriptionOptions?: SubscriptionOptions,
    stream?: StreamId,
    height?: ?number,
    width?: ?number,
    onError?: ?Function
}

export default class StreamrMapComponent extends Component<Props> {
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

    map: ?StreamrMap

    renderWidget = (root: ?HTMLDivElement, options: Options) => {
        if (root) {
            this.map = new StreamrMap(root, options)
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
