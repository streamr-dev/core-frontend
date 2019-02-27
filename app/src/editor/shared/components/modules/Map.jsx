// @flow

import React from 'react'
import cx from 'classnames'
import isEqual from 'lodash/isEqual'
import throttle from 'lodash/throttle'
import merge from 'lodash/merge'

import Map, { type Marker } from '../Map/Map'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Map.pcss'

const UPDATE_INTERVAL_MS = 250

type Props = {
    className: string,
    module: Object,
}

type State = {
    markers: { [string]: Marker },
}

type Message = {
    t: string,
    color: string,
    id: string,
    lat: number,
    lng: number,
    dir: number,
}

export default class MapModule extends React.Component<Props, State> {
    state = {
        markers: {},
    }

    queuedMarkers = {}

    onMessage = (msg: Message) => {
        if (msg.t === 'p') {
            const marker = this.getMarkerFromMessage(msg)

            // Check if data has changed
            if (isEqual(this.queuedMarkers[msg.id], marker) &&
                isEqual(this.state.markers[msg.id], marker)) {
                return
            }

            // Update marker data
            this.queuedMarkers = {
                ...this.queuedMarkers,
                [marker.id]: marker,
            }
            this.flushMarkerData()
        } else {
            console.error('Unknown message on MapModule:', msg)
        }
    }

    getMarkerFromMessage = (msg: Message): Marker => (
        {
            id: msg.id,
            lat: msg.lat,
            long: msg.lng,
            rotation: msg.dir,
        }
    )

    flushMarkerData = throttle(() => {
        const { queuedMarkers } = this
        this.queuedMarkers = {}

        this.setState((state) => ({
            markers: merge(state.markers, queuedMarkers),
        }))
    }, UPDATE_INTERVAL_MS)

    render() {
        const { className, module: moduleData } = this.props
        const { markers } = this.state
        const traceColor = moduleData.params
            .filter((p) => p.name === 'traceColor')
            .map((p) => p.value)

        return (
            <div className={cx(className)}>
                <ModuleSubscription
                    {...this.props}
                    onMessage={this.onMessage}
                />
                <Map
                    {...this.props.module.options}
                    className={styles.map}
                    centerLat={moduleData.options.centerLat.value || 60.18}
                    centerLong={moduleData.options.centerLng.value || 24.92}
                    zoom={moduleData.options.zoom.value || 12}
                    traceColor={traceColor || '#FFFFFF'}
                    markers={markers}
                />
            </div>
        )
    }
}
