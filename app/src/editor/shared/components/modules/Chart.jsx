import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import Highcharts from 'highcharts/highstock'

import HighchartsReact from 'highcharts-react-official'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'

import styles from './Chart.pcss'

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

export default class ChartModule extends React.Component {
    queuedDatapoints = []
    state = {
        title: 'My Chart',
        datapoints: [],
        series: [],
    }

    minTime = Number.POSITIVE_INFINITY
    maxTime = Number.POSITIVE_INFINITY

    onDataPoint = (d) => {
        if (d.x != null) {
            this.minTime = Math.min(d.x, this.minTime)
        }
        if (d.x != null) {
            this.maxTime = Math.max(d.x, this.maxTime)
        }
        this.queuedDatapoints.push(d)
        this.flushDataPoints()
    }

    flushDataPoints = throttle(() => {
        const { queuedDatapoints } = this
        this.queuedDatapoints = []
        this.setState(({ datapoints }) => ({
            datapoints: datapoints.concat(queuedDatapoints),
        }))
    }, 250)

    onSeries = (d) => {
        if (!this.chart) { return null }
        const id = `series-${d.idx}`
        const series = this.chart.get(id)
        const seriesData = {
            ...d,
            id,
        }

        if (!series) {
            this.chart.addSeries(seriesData)
        } else {
            series.update(seriesData)
        }
    }

    onMessage = (d) => {
        if (d.type === 'p') {
            this.onDataPoint(d)
        }
        if (d.type === 's') {
            this.onSeries(d)
        }
    }

    componentDidMount() {
        this.load()
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
        if (this.chart && prevProps.layoutKey !== this.props.layoutKey) {
            this.resize()
        }
    }

    resize = debounce(() => {
        if (this.chart) {
            this.chart.reflow()
        }
    }, 0)

    load = async () => {
        const { initRequest } = await this.props.send({
            type: 'initRequest',
        })
        this.setState(initRequest)
    }

    onChart = (chart) => {
        this.chart = chart
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
        const { module, isActive, className } = this.props
        const { options = {} } = module
        const { title } = this.state
        const seriesData = this.getSeriesData(this.state.datapoints)

        return (
            <div className={cx(styles.Chart, className)}>
                <ModuleSubscription isActive={isActive} onMessage={this.onMessage} />
                {!!(options.displayTitle && options.displayTitle.value && title) && (
                    <h4>{title}</h4>
                )}
                {!!this.state.series && (
                    <HighchartsReact
                        key={isActive}
                        highcharts={Highcharts}
                        constructorType="stockChart"
                        allowChartUpdate={false}
                        callback={this.onChart}
                        options={{
                            title: {
                                text: this.state.title,
                            },
                            chart: {
                                animation: false,
                                panning: true,
                                spacingBottom: 40,
                                backgroundColor: null,
                                zoomType: 'x',
                            },
                            time: {
                                timezoneOffset: new Date().getTimezoneOffset(),
                            },
                            credits: {
                                enabled: false,
                            },
                            xAxis: {
                                ordinal: false,
                            },
                            legend: {
                                enabled: true,
                            },
                            rangeSelector: {
                                enabled: false,
                            },
                            navigator: {
                                enabled: true,
                                series: {
                                    type: 'line',
                                    step: true,
                                },
                            },
                            plotOptions: {
                                series: {
                                    animation: false,
                                    dataGrouping: {
                                        approximation: approximations[options.dataGrouping],
                                    },
                                },
                            },
                            scrollbar: {
                                enabled: false,
                            },
                            series: this.state.series.map((s) => ({
                                ...s,
                                ...seriesData[s.idx],
                                id: `series-${s.idx}`,
                            })),
                            ...options,
                        }}
                    />
                )}
            </div>
        )
    }
}

