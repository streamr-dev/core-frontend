// @flow

import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import cx from 'classnames'
import 'leaflet/dist/leaflet.css'
import { Map as LeafletMap, ImageOverlay, TileLayer, Tooltip, Polyline, type LatLngBounds } from 'react-leaflet'
import L from 'leaflet'
import Control from 'react-leaflet-control'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import debounce from 'lodash/debounce'

import useIsMounted from '$shared/hooks/useIsMounted'
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
    label?: ?string,
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

const tileAttribution = `
    &copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
    &copy; <a href="https://cartodb.com/attributions">CartoDB</a>,
    Streamr
`.trim()

function getTileUrl(skin) {
    if (skin === 'cartoDark') {
        return '//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    }
    return '//{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
}

function useDebouncedCallback(fn, deps, ...args) {
    const debouncedFn = useCallback(debounce(fn, ...args))

    const debouncedFnRef = useRef()
    if (debouncedFnRef.current && debouncedFnRef.current !== debouncedFn) {
        // cancel existing debounced fn if changing callback
        debouncedFnRef.current.cancel()
    }
    debouncedFnRef.current = debouncedFn
    return debouncedFn
}

export default function Map(props: Props) {
    const isMounted = useIsMounted()
    const ref: Ref<LeafletMap> = useRef()

    const [touched, setTouched] = useState(false)
    const markTouched = useCallback(() => setTouched(true), [setTouched])
    const resetTouched = useCallback(() => setTouched(false), [setTouched])

    useEffect(() => {
        const { current: map } = ref
        if (!map) { return }
        // detect clicks on zoom control
        map.leafletElement.zoomControl.getContainer().addEventListener('click', () => {
            if (!isMounted()) { return }
            markTouched()
        }, true)
    }, [isMounted, markTouched])

    const onResize = useCallback(() => {
        const { current: map } = ref

        if (map) {
            map.leafletElement.invalidateSize(false)
        }
    }, [ref])

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key.startsWith('Arrow') || event.key === '+' || event.key === '-') {
            // mark changed for leaflet handled keys
            markTouched()
        }
    }, [markTouched])

    const propsRef = useRef(props)

    // debounce as zoomEnd/moveEnd fire in quick succession
    const onViewportChanged = useDebouncedCallback(() => {
        if (!isMounted()) { return }
        const { onViewportChanged: onViewportChangedProp, zoom, centerLat, centerLong } = propsRef.current
        const { current: map } = ref
        if (!map) { return }
        const newZoom = map.leafletElement.getZoom()
        const newCenter = map.leafletElement.getCenter()

        if (newZoom !== zoom || newCenter.lat !== centerLat || newCenter.lng !== centerLong) {
            onViewportChangedProp(newCenter.lat, newCenter.lng, newZoom)
        }
    }, [propsRef, ref, isMounted], 250)

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
    } = props
    const mapCenter = [centerLat, centerLong]
    const tileUrl = getTileUrl(skin)

    const markerArray: Array<Marker> = useMemo(() => ((Object.values(markers): any): Array<Marker>), [markers])

    const bounds: ?LatLngBounds = useMemo(() => {
        if (autoZoom && markerArray.length > 0 && !touched) {
            const positions = markerArray.map((m) => [m.lat, m.long])
            return L.latLngBounds(positions).pad(0.2)
        }
        return null
    }, [markerArray, autoZoom, touched])

    return (
        <UiSizeConstraint minWidth={368} minHeight={224}>
            <div
                className={className}
                onMouseDown={markTouched}
                onKeyDown={onKeyDown}
                onWheel={markTouched}
                role="presentation"
            >
                <LeafletMap
                    ref={ref}
                    center={mapCenter}
                    zoom={zoom}
                    className={styles.leafletMap}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    crs={isImageMap ? L.CRS.Simple : L.CRS.EPSG3857}
                    preferCanvas
                    bounds={bounds}
                    onMoveEnd={onViewportChanged}
                    onZoomEnd={onViewportChanged}
                >
                    {!!autoZoom && (
                        <Control position="topleft">
                            <button
                                className={cx(styles.control, {
                                    [styles.disabledControl]: !touched,
                                })}
                                onClick={resetTouched}
                                aria-label="Restart Autozoom"
                                title="Restart Autozoom"
                                type="button"
                            >
                                &#9678;
                            </button>
                        </Control>
                    )}
                    <ResizeWatcher onResize={onResize} />
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
