// @flow

import React from 'react'
import cx from 'classnames'
import isEqual from 'lodash/isEqual'
import throttle from 'lodash/throttle'
import merge from 'lodash/merge'
import remove from 'lodash/remove'

import Map, { type Marker, type TracePoint } from '../Map/Map'
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
    color: string,
    tracePointId?: string,
    markerList?: Array<string>,
    pointList?: Array<string>,
}

export default class MapModule extends React.Component<Props, State> {
    state = {
        markers: {},
    }

    queuedMarkers: { [string]: Marker } = {}
    positionHistory: { [string]: Array<TracePoint> } = {}
    unmounted = false

    componentWillUnmount() {
        this.unmounted = true
    }

    onMessage = (msg: Message) => {
        if (msg.t === 'p') {
            const marker = this.getMarkerFromMessage(msg)

            // Check if data has changed
            if (isEqual(this.queuedMarkers[msg.id], marker) &&
                isEqual(this.state.markers[msg.id], marker)) {
                return
            }

            // If tracing is enabled, update last positions
            if (this.props.module.options.drawTrace.value && msg.tracePointId) {
                this.addTracePoint(marker.id, marker.lat, marker.long, msg.tracePointId)
                marker.previousPositions = this.positionHistory[marker.id]
            }

            // Update marker data
            this.queuedMarkers = {
                ...this.queuedMarkers,
                [marker.id]: marker,
            }
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
        const { type, value } = obj
        if ((type === 'int' || type === 'double') && value != null) {
            return value
        } else if (!value) {
            return defaultValue
        }
        return value
    }

    flushMarkerData = throttle(() => {
        if (this.unmounted) {
            return
        }

        const { queuedMarkers } = this
        this.queuedMarkers = {}

        this.setState((state) => ({
            markers: merge(state.markers, queuedMarkers),
        }))
    }, UPDATE_INTERVAL_MS)

    render() {
        const { className } = this.props
        const { markers } = this.state

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
                    traceColor={this.getModuleParam('traceColor', '#FFFFFF')}
                    traceWidth={this.getModuleOption('traceWidth', 2)}
                    markerIcon={markerIcon}
                    markers={markers}
                    markerColor={this.getModuleOption('markerColor', '#FFFFFF')}
                    directionalMarkers={directionalMarkers}
                    skin={this.getModuleOption('skin', 'default')}
                />
            </div>
        )
    }
}
