// @flow

import React from 'react'
import cx from 'classnames'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap, ImageOverlay, TileLayer, Tooltip, Polyline, type LatLngBounds } from 'react-leaflet'
import L from 'leaflet'
import Control from 'react-leaflet-control'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import debounce from 'lodash/debounce'

import { type Ref } from '$shared/flowtype/common-types'
import ResizeWatcher from '$editor/canvas/components/Resizable/ResizeWatcher'

import UiSizeConstraint from '../UiSizeConstraint'
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
    autoZoom: boolean,
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
    // Events
    onViewportChanged: (centerLat: number, centerLong: number, zoom: number) => void,
}

type State = {
    touched: boolean,
}

export default class Map extends React.PureComponent<Props, State> {
    ref: Ref<LeafletMap> = React.createRef()
    unmounted: boolean = false
    bounds: ?LatLngBounds = null

    state = {
        touched: false,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidMount() {
        const { current: map } = this.ref
        if (!map) { return }
        // detect clicks on zoom control
        map.leafletElement.zoomControl.getContainer().addEventListener('click', () => {
            this.markTouched()
        }, true)
    }

    onResize = () => {
        const { current: map } = this.ref

        if (map) {
            map.leafletElement.invalidateSize(false)
        }
    }

    markTouched = () => {
        this.setState(({ touched }) => {
            if (touched) { return null }
            return {
                touched: true,
            }
        })
    }

    resetTouched = () => {
        this.setState({ touched: false })
    }

    calculateBounds = (markers: Array<Marker>, autoZoom: boolean) => {
        if (this.unmounted) { return }
        let { bounds } = this

        if (autoZoom && markers.length > 0 && !this.state.touched) {
            const positions = markers.map((m) => [m.lat, m.long])
            bounds = L.latLngBounds(positions).pad(0.2)
        }
        return bounds
    }

    onKeyDown = (event: KeyboardEvent) => {
        if (event.key.startsWith('Arrow') || event.key === '+' || event.key === '-') {
            // mark changed for leaflet handled keys
            this.markTouched()
        }
    }

    onViewportChanged = debounce(() => { // debounce as zoomEnd/moveEnd fire in quick succession
        if (this.unmounted) { return }
        const { current: map } = this.ref
        if (!map) { return }
        const { onViewportChanged, zoom, centerLat, centerLong } = this.props
        const newZoom = map.leafletElement.getZoom()
        const newCenter = map.leafletElement.getCenter()

        if (newZoom !== zoom || newCenter.lat !== centerLat || newCenter.lng !== centerLong) {
            onViewportChanged(newCenter.lat, newCenter.lng, newZoom)
        }
    }, 250)

    render() {
        const {
            className,
            centerLat,
            centerLong,
            minZoom,
            maxZoom,
            zoom,
            autoZoom,
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
        let tileAttribution = '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>, Streamr'
        let tileUrl = '//{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

        if (skin === 'cartoDark') {
            /* eslint-disable-next-line max-len */
            tileAttribution = '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>, Streamr'
            tileUrl = '//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        }

        // https://github.com/facebook/flow/issues/2221
        // $FlowFixMe Object.values() returns mixed[]
        const markerArray: Array<Marker> = Object
            .values(markers)

        const bounds = this.calculateBounds(markerArray, autoZoom)

        return (
            <UiSizeConstraint minWidth={368} minHeight={224}>
                <div
                    className={cx(className)}
                    onMouseDown={this.markTouched}
                    onKeyDown={this.onKeyDown}
                    onWheel={this.markTouched}
                    role="presentation"
                >
                    <LeafletMap
                        ref={this.ref}
                        center={mapCenter}
                        zoom={zoom}
                        className={styles.leafletMap}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        crs={isImageMap ? L.CRS.Simple : L.CRS.EPSG3857}
                        preferCanvas
                        bounds={bounds}
                        onMoveEnd={this.onViewportChanged}
                        onZoomEnd={this.onViewportChanged}
                    >
                        {this.props.autoZoom && (
                            <Control position="topleft">
                                <button
                                    className={cx(styles.control, {
                                        [styles.disabledControl]: !this.state.touched,
                                    })}
                                    onClick={this.resetTouched}
                                    aria-label="Recenter"
                                    title="Recenter"
                                >
                                    &#9678;
                                </button>
                            </Control>
                        )}
                        <ResizeWatcher onResize={this.onResize} />
                        {isHeatmap && markerArray.length > 0 && (
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
                                            {marker.label || marker.id}
                                        </Tooltip>
                                    </CustomMarker>
                                    {tracePoints && tracePoints.length > 0 && (
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
