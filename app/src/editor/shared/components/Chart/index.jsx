// @flow

import React, { useState, useMemo, useEffect, useCallback, useContext } from 'react'
import cx from 'classnames'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import ResizeWatcher from '$editor/canvas/components/Resizable/ResizeWatcher'
import { Context as UiSizeContext } from '$editor/shared/components/UiSizeConstraint'
import RangeSelect from './RangeSelect'
import approximations from './approx'
import styles from './chart.pcss'

type Datapoint = {
    s: any,
    x: number,
    y: number,
}

type Props = {
    className?: ?string,
    datapoints: Array<Datapoint>,
    options: any,
    series: any,
}

const Chart = ({ className, series, datapoints, options }: Props) => {
    const [chart, setChart] = useState(null)

    const seriesData = useMemo(() => (
        Object.values(series).map((payload: any) => ({
            ...payload,
            data: datapoints[payload.idx] || [],
        }))
    ), [series, datapoints])

    const onResize = useCallback(() => {
        if (chart) {
            chart.reflow()
        }
    }, [chart])

    const [range, setRange] = useState(undefined)

    const setExtremes = useCallback((range: any) => {
        setRange(range)

        if (chart) {
            const [xAxis] = chart.xAxis
            const { dataMin, dataMax, max } = xAxis.getExtremes()

            if (typeof range !== 'number') {
                xAxis.setExtremes(dataMin, dataMax, true, false)
            } else {
                xAxis.setExtremes(Math.max(max - range, dataMin), max, true, false)
            }
        }
    }, [chart])

    const onSetExtremes = useCallback((e: any) => {
        if (e.trigger !== 'zoom' && e.trigger !== 'navigator') {
            return
        }

        if (e.min != null && e.max != null) {
            setRange(e.max - e.min)
        } else {
            setRange(undefined)
        }
    }, [])

    useEffect(() => {
        if (chart) {
            seriesData.forEach((data) => {
                const series = chart.get(data.id)
                if (series) {
                    series.update(data)
                } else {
                    chart.addSeries(data)
                }
            })
            chart.redraw()
        }
    }, [chart, seriesData])

    const { height } = useContext(UiSizeContext)

    useEffect(() => {
        if (chart) {
            // 40px = RangeSelect toolbar height
            chart.setSize(undefined, height > 40 ? (height - 40) : null, false)
        }
    }, [height, chart])

    const opts = useMemo(() => ({
        chart: {
            animation: false,
            backgroundColor: null,
            reflow: false,
            selectionMarkerFill: 'rgba(0, 0, 0, 0.05)',
            style: {
                fontFamily: "'IBM Plex Sans', sans-serif",
            },
            zoomType: 'x',
        },
        colors: ['#FF5C00', '#0324FF', '#2AC437', '#6240AF'],
        credits: {
            enabled: false,
        },
        legend: {
            align: 'left',
            enabled: true,
            itemStyle: {
                color: '#323232',
                fontSize: '10px',
                fontWeight: '500',
            },
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
            margin: 12,
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
                states: {
                    hover: {
                        halo: {
                            attributes: {
                                fill: 'white',
                                'fill-opacity': 1,
                                stroke: 'black',
                                'stroke-width': 1,
                                'stroke-opacity': 0.1,
                            },
                            size: 8,
                        },
                    },
                },
            },
        },
        rangeSelector: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        series: [],
        time: {
            timezoneOffset: new Date().getTimezoneOffset(),
        },
        tooltip: {
            borderWidth: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            padding: 10,
            borderRadius: 4,
            style: {
                boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.05)',
                color: '#323232',
                lineHeight: 1.6,
                fontSize: '10px',
            },
            useHTML: true,
            // eslint-disable-next-line func-names, object-shorthand
            formatter: function () {
                // offset x value by timezone offset
                const timestamp = this.x - (new Date().getTimezoneOffset() * 60 * 1000)
                return this.points.reduce((s, point) => (
                    `${s}<br/><span style="font-weight: 500;">${point.series.name}</span> ${point.y}`
                ), `${Highcharts.dateFormat('%A, %b %e, %H:%M:%S', timestamp)}`)
            },
            outside: true,
        },
        xAxis: {
            crosshair: {
                color: '#EFEFEF',
            },
            events: {
                afterSetExtremes: onSetExtremes,
            },
            gridLineColor: '#EFEFEF',
            labels: {
                style: {
                    color: '#ADADAD',
                    fontSize: '10px',
                },
                y: 24,
            },
            lineColor: '#EFEFEF',
            ordinal: false,
            tickWidth: 0,
        },
        yAxis: {
            gridLineColor: '#EFEFEF',
            labels: {
                style: {
                    color: '#ADADAD',
                    fontSize: '10px',
                },
            },
        },
        ...options,
    }), [onSetExtremes, options])

    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.toolbar}>
                <RangeSelect
                    onChange={setExtremes}
                    value={range}
                />
            </div>
            <ResizeWatcher onResize={onResize} />
            <HighchartsReact
                highcharts={Highcharts}
                constructorType="stockChart"
                allowChartUpdate={false}
                callback={setChart}
                options={opts}
            />
        </div>
    )
}

export default Chart
