// @flow

import React from 'react'
import cx from 'classnames'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap, TileLayer, Tooltip, Polyline } from 'react-leaflet'

import CustomMarker from './Marker'

import styles from './Map.pcss'

export type TracePoint = {
    id: string,
    lat: number,
    long: number,
}

export type Marker = {
    id: string,
    lat: number,
    long: number,
    rotation: number,
    previousPositions?: Array<TracePoint>,
}

type Props = {
    className: string,
    centerLat: number,
    centerLong: number,
    zoom: number,
    traceColor: string,
    markers: { [string]: Marker },
    markerIcon: string,
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
            markerIcon,
        } = this.props
        const position = [centerLat, centerLong]

        // https://github.com/facebook/flow/issues/2221
        // $FlowFixMe Object.values() returns mixed[]
        const markerArray: Array<Marker> = Object
            .values(markers)

        return (
            <div className={cx(className)}>
                <LeafletMap
                    center={position}
                    zoom={zoom}
                    className={styles.leafletMap}
                >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Streamr'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markerArray.map((marker) => {
                        const pos = [marker.lat, marker.long]
                        const tracePoints = marker.previousPositions && marker.previousPositions
                            .map((p) => [p.lat, p.long])

                        return (
                            <React.Fragment key={marker.id}>
                                <CustomMarker
                                    key={marker.id}
                                    position={pos}
                                    rotation={marker.rotation}
                                    icon={markerIcon}
                                >
                                    <Tooltip direction="top">
                                        {marker.id}
                                    </Tooltip>
                                </CustomMarker>
                                {tracePoints && (
                                    <Polyline
                                        positions={tracePoints}
                                        color={traceColor}
                                    />
                                )}
                            </React.Fragment>
                        )
                    })}
                </LeafletMap>
            </div>
        )
    }
}
