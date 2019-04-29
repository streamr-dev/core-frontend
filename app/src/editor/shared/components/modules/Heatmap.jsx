// @flow

import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'

import Map from '../Map/Map'
import ModuleSubscription from '../ModuleSubscription'

import styles from './Map.pcss'

const UPDATE_INTERVAL_MS = 100

type Props = {
    className: string,
    module: Object,
}

type HeatmapMarker = {
    lat: number,
    long: number,
    value: number,
    ttl: number,
}

type State = {
    markers: Array<HeatmapMarker>,
    lastUpdate: number,
}

type HeatmapMessage = {
    t: string, // type
    g: number, // longitude
    l: number, // latitude
    v: number, // value
}

type Message = HeatmapMessage

export default class HeatmapModule extends React.Component<Props, State> {
    state = {
        markers: [],
        lastUpdate: 0,
    }

    updateInterval: IntervalID
    queuedMarkers: Array<HeatmapMarker> = []
    unmounted = false

    componentDidMount() {
        this.updateInterval = setInterval(this.updateMarkers, UPDATE_INTERVAL_MS)
    }

    componentWillUnmount() {
        this.unmounted = true
        clearInterval(this.updateInterval)
    }

    onMessage = (msg: Message) => {
        if (msg.t === 'p') {
            const marker = this.getMarkerFromMessage(msg)
            this.queuedMarkers.push(marker)
            this.flushMarkerData()
        } else {
            console.error('Unknown message type on HeatmapModule:', msg)
        }
    }

    getMarkerFromMessage = (msg: HeatmapMessage): HeatmapMarker => (
        {
            lat: msg.l,
            long: msg.g,
            value: msg.v,
            ttl: this.getModuleOption('lifeTime', 7000),
        }
    )

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

    flushMarkerData = throttle(() => {
        if (this.unmounted) {
            return
        }

        const { queuedMarkers } = this
        this.queuedMarkers = []

        this.setState(({ markers }) => ({
            markers: markers.concat(queuedMarkers),
        }))
    }, UPDATE_INTERVAL_MS)

    updateMarkers = () => {
        const { markers, lastUpdate } = this.state
        const now = Date.now()
        const timeDiff = now - lastUpdate

        markers.forEach((marker) => {
            marker.ttl -= timeDiff
        })

        this.setState(({ markers }) => ({
            lastUpdate: now,
            markers: markers.filter((m) => m.ttl > 0), // remove expired
        }))
    }

    render() {
        const { className } = this.props
        const { markers } = this.state

        const heatmapProps = {
            isHeatmap: true,
            fadeInTime: this.getModuleOption('fadeInTime', 500),
            fadeOutTime: this.getModuleOption('fadeOutTime', 500),
            lifeTime: this.getModuleOption('lifeTime', 7000),
            min: this.getModuleOption('min', 0),
            max: this.getModuleOption('max', 20),
            maxOpacity: this.getModuleOption('maxOpacity', 0.8),
            radius: this.getModuleOption('radius', 30),
            scaleRadius: this.getModuleOption('scaleRadius', false),
            useLocalExtrema: this.getModuleOption('useLocalExtrema', false),
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
                    markers={markers}
                    skin={this.getModuleOption('skin', 'default')}
                    {...heatmapProps}
                />
            </div>
        )
    }
}
