// @flow

import React from 'react'
import cx from 'classnames'
import isEqual from 'lodash/isEqual'
import throttle from 'lodash/throttle'
import remove from 'lodash/remove'
import L from 'leaflet'
import type { LatLngBounds } from 'react-leaflet'

import Map, { type Marker, type TracePoint } from '../Map/Map'
import ModuleSubscription from '../ModuleSubscription'
import { isRunning } from '$editor/canvas/state'

import styles from './Map.pcss'

const UPDATE_INTERVAL_MS = 50

type Props = {
    className?: ?string,
    module: Object,
    canvas: Object,
    api: any,
}

type State = {
    markers: { [string]: Marker },
    imageMap: boolean,
    imageReady: boolean,
    imageBounds: ?LatLngBounds,
}

type Message = {
    t: string,
    color: string,
    id: string,
    lat: number,
    lng: number,
    dir: number,
    color: string,
    tracePointId?: string,
    markerList?: Array<string>,
    pointList?: Array<string>,
}

/*
    MapModule handles following modules: Map, ImageMap
*/
export default class MapModule extends React.PureComponent<Props, State> {
    state = {
        markers: {},
        imageMap: !!('customImageUrl' in this.props.module.options),
        imageReady: false,
        imageBounds: null,
    }

    queuedMarkers: { [string]: Marker } = {}
    positionHistory: { [string]: Array<TracePoint> } = {}
    unmounted = false
    image: ?HTMLImageElement = null
    queuedMessages: Array<Message> = []

    componentDidMount() {
        const customImageUrl = this.getModuleOption('customImageUrl', null)

        if (customImageUrl) {
            this.loadImage(customImageUrl)
        }
    }

    componentWillUnmount() {
        if (this.image) {
            delete this.image
            this.image = null
        }
        this.unmounted = true
    }

    componentDidUpdate(prevProps: Props) {
        const customImageUrl = this.getModuleOption('customImageUrl', null)

        if (this.state.imageMap && customImageUrl !== prevProps.module.options.customImageUrl.value) {
            this.loadImage(customImageUrl)
        }

        if (this.props.canvas && isRunning(this.props.canvas) !== isRunning(prevProps.canvas) && isRunning(this.props.canvas)) {
            // Clear markers when canvas is started
            /* eslint-disable-next-line react/no-did-update-set-state */
            this.setState({
                markers: {},
            })
        }
    }

    onLoadImage = () => {
        if (this.unmounted || !this.image) { return }

        const { width, height } = this.image

        this.setState({
            imageReady: true,
            imageBounds: L.latLngBounds(L.latLng(height, 0), L.latLng(0, width)),
        }, () => {
            this.queuedMessages.forEach(this.onMessage)
            this.queuedMessages = []
        })
    }

    loadImage = (url: string) => {
        if (this.image) {
            delete this.image
            this.image = null
        }

        this.setState({
            imageReady: false,
            imageBounds: null,
        }, () => {
            this.image = new Image()
            this.image.onload = this.onLoadImage
            this.image.src = url
        })
    }

    onMessage = (msg: Message) => {
        const { imageMap, imageReady } = this.state

        // If the image has not yet loaded, we are not ready to handle any messages. Queue them instead
        if (imageMap && !imageReady) {
            this.queuedMessages.push(msg)
        } else if (msg.t === 'p') {
            const marker = this.getMarkerFromMessage(msg)

            if (imageMap && imageReady && this.image) {
                marker.long *= this.image.width
                marker.lat *= this.image.height
            }

            // Check if data has changed
            if (isEqual(this.queuedMarkers[msg.id], marker) &&
                isEqual(this.state.markers[msg.id], marker)) {
                return
            }

            // If tracing is enabled, update last positions
            if (this.props.module.options.drawTrace &&
                this.props.module.options.drawTrace.value &&
                msg.tracePointId
            ) {
                this.addTracePoint(marker.id, marker.lat, marker.long, msg.tracePointId)
                marker.previousPositions = this.positionHistory[marker.id]
            }

            // Update marker data
            this.queuedMarkers[marker.id] = marker
            this.flushMarkerData()
        } else if (msg.t === 'd') {
            if (msg.pointList && msg.pointList.length > 0) {
                const { pointList } = msg

                // $FlowFixMe Object.values() returns mixed[]
                const tracePoints: Array<Array<TracePoint>> = Object
                    .values(this.positionHistory)
                tracePoints.forEach((points) => {
                    remove(points, (p: TracePoint) => pointList.includes(p.id))
                })
            }

            if (msg.markerList && msg.markerList.length > 0) {
                const { markerList } = msg

                markerList.forEach((id) => {
                    delete this.queuedMarkers[id]
                    // NOTE: We should not mutate state but for performance reasons
                    // it is better to do it here directly instead of a setState call.
                    // This needs to be done before flushMarkerData performs state
                    // merging.
                    delete this.state.markers[id]
                })

                // Update marker data
                this.flushMarkerData()
            }
        } else {
            console.error('Unknown message type on MapModule:', msg)
        }
    }

    getMarkerFromMessage = (msg: Message): Marker => (
        {
            id: msg.id,
            lat: msg.lat,
            long: msg.lng,
            rotation: msg.dir,
            previousPositions: [],
        }
    )

    addTracePoint = (id: string, lat: number, long: number, tracePointId: string) => {
        let posArray = this.positionHistory[id]

        if (posArray == null) {
            posArray = []
            this.positionHistory[id] = posArray
        }

        const tracePoint: TracePoint = {
            id: tracePointId,
            lat,
            long,
        }
        posArray.unshift(tracePoint)
    }

    getModuleOption = (key: string, defaultValue: any) => {
        const obj = this.props.module.options[key]
        return this.getValueOrDefault(obj, defaultValue)
    }

    getModuleParam = (key: string, defaultValue: any) => {
        const matchingParams = this.props.module.params
            .filter((p) => p.name === key)

        if (matchingParams.length > 0) {
            return this.getValueOrDefault(matchingParams[0], defaultValue)
        }
        return defaultValue
    }

    getValueOrDefault = (obj: { type: string, value: any }, defaultValue: any) => {
        const { type, value } = obj || {}
        if ((type === 'int' || type === 'double') && value != null) {
            return value
        } else if (!value) {
            return defaultValue
        }
        return value
    }

    onViewportChanged = (centerLat: number, centerLong: number, zoom: number) => {
        const { module, api } = this.props
        const nextModule = {
            ...module,
            options: {
                ...module.options,
                centerLat: {
                    ...module.options.centerLat,
                    value: centerLat,
                },
                centerLng: {
                    ...module.options.centerLng,
                    value: centerLong,
                },
                zoom: {
                    ...module.options.zoom,
                    value: zoom,
                },
            },
        }
        api.updateModule(module.hash, nextModule)
    }

    flushMarkerData = throttle(() => {
        if (this.unmounted) {
            return
        }

        const { queuedMarkers } = this
        this.queuedMarkers = {}

        this.setState((state) => {
            const markers = { ...state.markers }
            // $FlowFixMe Object.values() returns mixed[]
            Object.values(queuedMarkers).forEach((m: Marker) => {
                const marker = markers[m.id]
                if (marker) {
                    marker.lat = m.lat
                    marker.long = m.long
                    marker.rotation = m.rotation
                } else {
                    markers[m.id] = m
                }
            })
            return {
                markers,
            }
        })
    }, UPDATE_INTERVAL_MS)

    render() {
        const { className } = this.props
        const { markers, imageBounds, imageMap } = this.state

        const directionalMarkers = this.getModuleOption('directionalMarkers', false)
        let markerIcon = this.getModuleOption('markerIcon', 'circle')
        if (directionalMarkers) {
            markerIcon = this.getModuleOption('directionalMarkerIcon', 'arrow')
        }

        return (
            <div className={cx(className)}>
                <ModuleSubscription
                    {...this.props}
                    onMessage={this.onMessage}
                />
                <Map
                    {...this.props.module.options}
                    className={styles.map}
                    centerLat={this.getModuleOption('centerLat', 60.18)}
                    centerLong={this.getModuleOption('centerLng', 24.92)}
                    minZoom={this.getModuleOption('minZoom', 2)}
                    maxZoom={this.getModuleOption('maxZoom', 18)}
                    zoom={this.getModuleOption('zoom', 12)}
                    autoZoom={this.getModuleOption('autoZoom', false)}
                    /* For Map */
                    traceColor={this.getModuleParam('traceColor', '#FFFFFF')}
                    traceWidth={this.getModuleOption('traceWidth', 2)}
                    markerIcon={markerIcon}
                    markers={markers}
                    markerColor={this.getModuleOption('markerColor', '#FFFFFF')}
                    directionalMarkers={directionalMarkers}
                    skin={this.getModuleOption('skin', 'default')}
                    /* For ImageMap */
                    isImageMap={imageMap}
                    imageBounds={imageBounds}
                    imageUrl={this.getModuleOption('customImageUrl', null)}
                    /* Events */
                    onViewportChanged={this.onViewportChanged}
                />
            </div>
        )
    }
}
