// @flow

import React from 'react'
import cx from 'classnames'
import isEqual from 'lodash/isEqual'

import Map, { type Marker } from '../Map'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Map.pcss'

type Props = {
    className: string,
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

    onMessage = (msg: Message) => {
        if (msg.t === 'p') {
            // Limit markers for development
            const idNum = Number.parseInt(msg.id, 10)
            if (idNum > 200) {
                return
            }
            const marker = this.getMarkerFromMessage(msg)

            // Check if data changed
            if (isEqual(this.state.markers[msg.id], marker)) {
                return
            }

            // Update marker data
            this.setState((state) => ({
                markers: {
                    ...state.markers,
                    [marker.id]: marker,
                },
            }))
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

    render() {
        const { className } = this.props
        const { markers } = this.state

        return (
            <div className={cx(className)}>
                <ModuleSubscription
                    {...this.props}
                    onMessage={this.onMessage}
                />
                <Map
                    className={styles.map}
                    markers={markers}
                />
            </div>
        )
    }
}
