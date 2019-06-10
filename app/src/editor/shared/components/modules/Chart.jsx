/* eslint-disable */

import React, { useRef, useCallback, useState, useEffect } from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import Highcharts from 'highcharts/highstock'

import useIsMounted from '$shared/hooks/useIsMounted'
import Chart from '$editor/shared/components/Chart'
import HighchartsReact from 'highcharts-react-official'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import SvgIcon from '$shared/components/SvgIcon'
import UiSizeConstraint from '../UiSizeConstraint'
import ResizeWatcher from '$editor/canvas/components/Resizable/ResizeWatcher'

import styles from './Chart.pcss'

const rangeConfig = {
    All: 'all',
    '1 month': 30 * 24 * 60 * 60 * 1000,
    '1 week': 7 * 24 * 60 * 60 * 1000,
    '1 day': 24 * 60 * 60 * 1000,
    '12 hours': 12 * 60 * 60 * 1000,
    '8 hours': 8 * 60 * 60 * 1000,
    '4 hours': 4 * 60 * 60 * 1000,
    '2 hours': 2 * 60 * 60 * 1000,
    '1 hour': 1 * 60 * 60 * 1000,
    '30 minutes': 30 * 60 * 1000,
    '15 minutes': 15 * 60 * 1000,
    '1 minute': 1 * 60 * 1000,
    '15 seconds': 15 * 1000,
    '1 second': 1 * 1000,
}

const approximations = {
    'min/max': (points) => {
        // Smarter data grouping: for all-positive values choose max, for all-negative choose min, for neither choose avg
        let sum = 0
        let min = Number.POSITIVE_INFINITY
        let max = Number.NEGATIVE_INFINITY

        points.forEach((it) => {
            sum += it
            min = Math.min(it, min)
            max = Math.max(it, max)
        })

        if (!points.length && points.hasNulls) {
            // If original had only nulls, Highcharts expects null
            return null
        } else if (!points.length) {
            // "Ordinary" empty group, Highcharts expects undefined
            return undefined
        } else if (min >= 0) {
            // All positive
            return max
        } else if (max <= 0) {
            // All negative
            return min
        }
        // Mixed positive and negative
        return sum / points.length
    },
    average: 'average',
    open: 'open',
    high: 'high',
    low: 'low',
    close: 'close',
}

class MinMax {
    min = Number.POSITIVE_INFINITY
    max = Number.NEGATIVE_INFINITY

    update(v) {
        if (v == null) { return }
        this.min = Math.min(v, this.min)
        this.max = Math.max(v, this.max)
    }
}

const ChartModule2 = (props) => {
    const { isActive, canvas, module } = props
    
    const subscriptionRef = useRef(null)

    const queuedDatapointsRef = useRef([])

    const [datapoints, setDatapoints] = useState([])

    const [series, setSeries] = useState({})

    const onSeries = useCallback((payload) => {
        const id = `series-${payload.idx}`

        setSeries((series) => ({
            ...series,
            [id]: {
                ...(series[id] || {}),
                ...payload,
                id,
            },
        }))
    }, [])

    const isMounted = useIsMounted()

    const flushDatapoints = useCallback(throttle(() => {
        if (!isMounted()) {
            return
        }

        const queued = queuedDatapointsRef.current || []
        queuedDatapointsRef.current = []

        setDatapoints((datapoints) => [
            ...datapoints,
            ...queued,
        ])
    }, 250), [])

    const onDatapoint = useCallback((payload) => {
        queuedDatapointsRef.current.push(payload)
        flushDatapoints()
    }, [])

    const onMessage = useCallback((payload) => {
        switch (payload.type) {
            case 'p':
                onDatapoint(payload)
                break
            case 's':
                onSeries(payload)
                break
            default:
                // noop
        }
    }, [])

    const init = useCallback(async () => {
        const { current: subscription } = subscriptionRef

        if (!subscription || !isActive || (canvas && canvas.adhoc)) {
            return
        }

        const { initRequest: { series } } = await subscription.send({
            type: 'initRequest',
        })

        if (isMounted()) {
            series.forEach(onSeries)
        }
    }, [isActive, canvas])

    const initRef = useRef()
    initRef.current = init

    useEffect(() => {
        // Run init onMount. Ignore further updates.
        initRef.current()
    }, [])

    return (
        <UiSizeConstraint minWidth={300} minHeight={200}>
                <ModuleSubscription
                    {...props}
                    onActiveChange={init}
                    onMessage={onMessage}
                    ref={subscriptionRef}
                />
                <Chart
                    className={styles.chart}
                    datapoints={datapoints}
                    options={module.options || {}}
                    series={series}
                />
        </UiSizeConstraint>
    )
}

class ChartModule extends React.Component {
    subscription = React.createRef()

    queuedDatapoints = []
    state = {
        title: 'My Chart',
        datapoints: [],
        series: [],
        range: 'all',
    }

    timeRange = new MinMax()
    seriesRanges = {}

    onMessage = (m) => {
        console.log(m)
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.chart && prevState.datapoints !== this.state.datapoints) {
            const seriesData = this.getSeriesData(this.state.datapoints)
            seriesData.forEach((s) => {
                const series = this.chart.get(s.id)
                if (!series) {
                    this.chart.addSeries(s)
                } else {
                    series.setData(s.data, true, true, true)
                }
            })
        }
        // const { module } = this.props
        // if (this.chart && JSON.stringify(module.layout) !== JSON.stringify(prevProps.module.layout)) {
        //     this.resize()
        // } else {
        //     this.redraw()
        // }
    }

    getSeriesData(datapoints) {
        const seriesData = {}
        datapoints.forEach((point) => {
            seriesData[point.s] = seriesData[point.s] || []
            seriesData[point.s].push([point.x, point.y])
        })
        return Object.entries(seriesData).map(([key, data]) => ({
            id: `series-${key}`,
            ...this.state.series[key],
            type: 'line',
            data,
        }))
    }

    render() {
        const { className, module } = this.props
        const { options = {} } = module
        const { title, series, datapoints } = this.state

        return (
            <UiSizeConstraint minWidth={300} minHeight={200}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    onMessage={this.onMessage}
                    onActiveChange={this.initIfActive}
                />
                {!!(options.displayTitle && options.displayTitle.value && title) && (
                    <h4>{title}</h4>
                )}
                <Chart
                    className={styles.chart}
                    datapoints={datapoints}
                    options={options}
                    series={series}
                />
            </UiSizeConstraint>
        )
    }
}

export default ChartModule2
