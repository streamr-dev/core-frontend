// @flow

import React from 'react'
import cx from 'classnames'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap, TileLayer, Tooltip, Polyline } from 'react-leaflet'

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
    centerLat: number,
    centerLong: number,
    zoom: number,
    traceColor: string,
    markers: { [string]: Marker },
}

export default class Map extends React.Component<Props> {
    render() {
        const {
            className,
            centerLat,
            centerLong,
            zoom,
            traceColor,
            markers,
        } = this.props
        const position = [centerLat, centerLong]

        const markerArray = Object
            .values(markers)

        const line = markerArray
            .filter((item, i) => i < 10)
            .map((marker: any) => [marker.lat, marker.long])

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
                            <CustomMarker
                                key={marker.id}
                                position={pos}
                                rotation={marker.rotation}
                            >
                                <Tooltip direction="top">
                                    {marker.id}
                                </Tooltip>
                            </CustomMarker>
                        )
                    })}

                    <Polyline positions={line} color={traceColor} />
                </LeafletMap>
            </div>
        )
    }
}
