// @flow

import React from 'react'
import cx from 'classnames'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap, ImageOverlay, TileLayer, Tooltip, Polyline, type LatLngBounds } from 'react-leaflet'
import L from 'leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import { type Ref } from '$shared/flowtype/common-types'

import UiSizeConstraint from '../UiSizeConstraint'
import ResizeWatcher from '$editor/canvas/components/Resizable/ResizeWatcher'
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
    value?: number, // used only in Heatmaps
}

export type Skin = 'default' | 'cartoDark'

type Props = {
    className?: ?string,
    centerLat: number,
    centerLong: number,
    minZoom: number,
    maxZoom: number,
    zoom: number,
    traceColor: string,
    traceWidth: number,
    markers: { [string]: Marker },
    markerIcon: string,
    markerColor: string,
    directionalMarkers: boolean,
    skin: Skin,
    // ImageMap
    isImageMap: boolean,
    imageBounds: ?LatLngBounds,
    imageUrl?: string,
    // Heatmap
    isHeatmap: boolean,
    radius: number,
    maxIntensity: number,
}

export default class Map extends React.Component<Props> {
    ref: Ref<LeafletMap> = React.createRef()

    onResize = () => {
        const { current: map } = this.ref

        if (map) {
            map.leafletElement.invalidateSize(false)
        }
    }

    render() {
        const {
            className,
            centerLat,
            centerLong,
            minZoom,
            maxZoom,
            zoom,
            traceColor,
            traceWidth,
            markers,
            markerIcon,
            markerColor,
            directionalMarkers,
            skin,
            isImageMap,
            imageBounds,
            imageUrl,
            isHeatmap,
            radius,
            maxIntensity,
        } = this.props
        const mapCenter = [centerLat, centerLong]

        /* eslint-disable-next-line max-len */
        let tileAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>, Streamr'
        let tileUrl = 'http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

        if (skin === 'cartoDark') {
            /* eslint-disable-next-line max-len */
            tileAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>, Streamr'
            tileUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        }

        // https://github.com/facebook/flow/issues/2221
        // $FlowFixMe Object.values() returns mixed[]
        const markerArray: Array<Marker> = Object
            .values(markers)

        return (
            <UiSizeConstraint minWidth={368} minHeight={224}>
                <div className={cx(className)}>
                    <LeafletMap
                        ref={this.ref}
                        center={mapCenter}
                        zoom={zoom}
                        className={styles.leafletMap}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        crs={isImageMap ? L.CRS.Simple : L.CRS.EPSG3857}
                    >
                        <ResizeWatcher onResize={this.onResize} />
                        {isHeatmap && (
                            <HeatmapLayer
                                fitBoundsOnLoad={false}
                                fitBoundsOnUpdate={false}
                                points={markerArray}
                                longitudeExtractor={(m: Marker) => m.long}
                                latitudeExtractor={(m: Marker) => m.lat}
                                intensityExtractor={(m: Marker) => m.value}
                                radius={radius}
                                max={maxIntensity}
                            />
                        )}
                        {!isImageMap && (
                            <TileLayer
                                attribution={tileAttribution}
                                url={tileUrl}
                            />
                        )}
                        {isImageMap && !!imageUrl && !!imageBounds && (
                            <ImageOverlay
                                url={imageUrl}
                                bounds={imageBounds}
                            />
                        )}
                        {!isHeatmap && markerArray.map((marker) => {
                            const pos = [marker.lat, marker.long]
                            const tracePoints = marker.previousPositions && marker.previousPositions
                                .map((p) => [p.lat, p.long])

                            return (
                                <React.Fragment key={marker.id}>
                                    <CustomMarker
                                        key={marker.id}
                                        position={pos}
                                        rotation={directionalMarkers ? marker.rotation : 0}
                                        icon={markerIcon}
                                        color={markerColor}
                                    >
                                        <Tooltip direction="top">
                                            {marker.id}
                                        </Tooltip>
                                    </CustomMarker>
                                    {tracePoints && (
                                        <Polyline
                                            positions={tracePoints}
                                            color={traceColor}
                                            weigth={traceWidth}
                                        />
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </LeafletMap>
                </div>
            </UiSizeConstraint>
        )
    }
}
