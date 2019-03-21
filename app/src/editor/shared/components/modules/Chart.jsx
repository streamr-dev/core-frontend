import React from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import Highcharts from 'highcharts/highstock'

import HighchartsReact from 'highcharts-react-official'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import SvgIcon from '$shared/components/SvgIcon'

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

function RangeDropdown(props) {
    let { value } = props
    const selected = Object.keys(rangeConfig).find((name) => rangeConfig[name] === props.value)
    if (!selected) {
        value = 'Range'
    }

    return (
        <div className={styles.RangeDropdown}>
            <select
                title="Range"
                value={value}
                onChange={(event) => {
                    let { value } = event.target
                    if (value !== 'all') {
                        value = parseInt(value, 10)
                    }

                    props.onChange(value)
                }}
            >
                {value === 'Range' && (
                    <option value="Range" disabled>
                        Range
                    </option>
                )}
                {Object.entries(rangeConfig).map(([name, range]) => (
                    <option value={range} key={name}>
                        {name}
                    </option>
                ))}
            </select>
            <SvgIcon name="caretDown" className={styles.caret} />
        </div>
    )
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

export default class ChartModule extends React.Component {
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

    updateRanges(d) {
        this.timeRange.update(d.x)
        this.seriesRanges[d.s] = this.seriesRanges[d.s] || new MinMax()
        this.seriesRanges[d.s].update(d.x)
    }

    onDataPoint = (d) => {
        this.updateRanges(d)
        this.queuedDatapoints.push(d)
        this.flushDataPoints()
    }

    flushDataPoints = throttle(() => {
        if (this.unmounted) { return }
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
        this.initIfActive(this.props.isActive)
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
        const { module } = this.props
        if (this.chart && JSON.stringify(module.layout) !== JSON.stringify(prevProps.module.layout)) {
            this.resize()
        } else {
            this.redraw()
        }
    }

    redraw = () => {
        if (!this.chart) { return }
        let max
        let min
        if (this.state.range === 'all' || !this.state.range) {
            max = this.timeRange.max // eslint-disable-line prefer-destructuring
            min = this.timeRange.min // eslint-disable-line prefer-destructuring
        } else {
            if (!this.rangeMax || this.rangeMax >= this.lastTime) {
                this.rangeMax = this.timeRange.max
            }
            max = this.rangeMax

            min = this.rangeMin === this.timeRange.min
                ? this.timeRange.min
                : Math.max(max - this.state.range, this.timeRange.min)
        }

        this.lastTime = this.timeRange.max
        this.chart.xAxis[0].setExtremes(min, max, false, false)
        this.chart.redraw()
    }

    resize = debounce(() => {
        if (this.unmounted) { return }
        if (this.chart) {
            this.chart.reflow()
        }
    }, 10)

    initIfActive = (isActive) => {
        if (isActive) {
            this.init()
        }
    }

    init = async () => {
        const { initRequest } = await this.subscription.current.send({
            type: 'initRequest',
        })
        if (this.unmounted) { return }
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

    onChangeRange = (range) => {
        this.setState({ range })
    }

    setExtremes = (e) => {
        if (this.unmounted) { return }
        if (e.trigger === 'navigator' || e.trigger === 'zoom') {
            this.rangeMin = e.min
            this.rangeMax = e.max
            this.setState({ range: e.max - e.min })
        }
    }

    render() {
        const { className, module } = this.props
        const { options = {} } = module
        const { title } = this.state
        const seriesData = this.getSeriesData(this.state.datapoints)

        return (
            <div className={cx(styles.Chart, className)}>
                <ModuleSubscription
                    {...this.props}
                    ref={this.subscription}
                    onMessage={this.onMessage}
                    onActiveChange={this.initIfActive}
                />
                {!!(options.displayTitle && options.displayTitle.value && title) && (
                    <h4>{title}</h4>
                )}
                <RangeDropdown onChange={this.onChangeRange} value={this.state.range} />
                {!!this.state.series && (
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType="stockChart"
                        allowChartUpdate={false}
                        callback={this.onChart}
                        options={{
                            chart: {
                                animation: false,
                                panning: true,
                                spacingBottom: 40,
                                backgroundColor: null,
                                zoomType: 'x',
                                selectionMarkerFill: 'rgba(0, 0, 0, 0.05)',
                            },
                            colors: ['#FF5C00', '#0324FF', '#2AC437', '#6240AF'],
                            time: {
                                timezoneOffset: new Date().getTimezoneOffset(),
                            },
                            credits: {
                                enabled: false,
                            },
                            xAxis: {
                                ordinal: false,
                                events: {
                                    setExtremes: this.setExtremes,
                                },
                            },
                            legend: {
                                enabled: true,
                            },
                            rangeSelector: {
                                enabled: false,
                            },
                            navigator: {
                                enabled: true,
                                maskFill: 'rgba(0, 0, 0, 0.05)',
                                outlineWidth: 0,
                                handles: {
                                    borderWidth: 1,
                                    borderColor: '#A0A0A0',
                                    backgroundColor: '#ADADAD',
                                    height: 16,
                                    width: 8,
                                },
                                series: {
                                    type: 'line',
                                    step: true,
                                    dataGrouping: {
                                        approximation: approximations.average,
                                        forced: true,
                                        groupAll: true,
                                        groupPixelWidth: 4,
                                    },
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

