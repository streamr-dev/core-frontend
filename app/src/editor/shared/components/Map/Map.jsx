// @flow

import React from 'react'
import cx from 'classnames'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap, TileLayer, Tooltip } from 'react-leaflet'

import CustomMarker from './Marker'

import styles from './Map.pcss'

export type Marker = {
    id: string,
    lat: number,
    long: number,
    rotation: number,
}

type Props = {
    className: string,
    markers: { [string]: Marker },
}

type State = {
    lat: number,
    long: number,
    zoom: number,
}

export default class Map extends React.Component<Props, State> {
    state = {
        lat: 60.18176,
        long: 24.955126,
        zoom: 12,
    }

    render() {
        const { className, markers } = this.props
        const { lat, long, zoom } = this.state
        const position = [lat, long]

        const markerArray = Object
            .values(markers)

        return (
            <div className={cx(className)}>
                <LeafletMap
                    center={position}
                    zoom={zoom}
                    /* preferCanvas */
                    className={styles.leafletMap}
                >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Streamr'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markerArray.map((marker: any) => {
                        const pos = [marker.lat, marker.long]
                        return (
                            <CustomMarker key={marker.id} position={pos}>
                                <Tooltip direction="top">
                                    {marker.id}
                                </Tooltip>
                            </CustomMarker>
                        )
                    })}
                </LeafletMap>
            </div>
        )
    }
}
