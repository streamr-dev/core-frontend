// @flow

import React, { useState, useMemo, useEffect, useCallback, useContext } from 'react'
import cx from 'classnames'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import ResizeWatcher from '$editor/canvas/components/Resizable/ResizeWatcher'
import { Context as UiSizeContext } from '$editor/shared/components/UiSizeConstraint'
import RangeSelect from './RangeSelect'
import styles from './chart.pcss'

type Datapoint = {
    s: any,
    x: number,
    y: number,
}

type Props = {
    className?: ?string,
    datapoints: Array<Datapoint>,
    series: any,
}

const Chart = ({ className, series, datapoints }: Props) => {
    const [chart, setChart] = useState(null)

    const seriesData = useMemo(() => {
        const data = datapoints.reduce((memo, { s, x, y }) => ({
            ...memo,
            [s]: [
                ...(memo[s] || []),
                [x, y],
            ],
        }), {})

        return Object.entries(data).map(([key, data]) => ({
            id: `series-${key}`,
            ...series[key],
            type: 'spline',
            step: undefined,
            data,
        }))
    }, [series, datapoints])

    const onResize = useCallback(() => {
        if (chart) {
            chart.reflow()
        }
    }, [chart])

    useEffect(() => {
        if (chart) {
            chart.redraw()
        }
    }, [chart, seriesData])

    const { height } = useContext(UiSizeContext)

    return (
        <div className={cx(styles.root, className)}>
            <div className={styles.toolbar}>
                <RangeSelect onChange={() => {}} />
            </div>
            <ResizeWatcher onResize={onResize} />
            <HighchartsReact
                highcharts={Highcharts}
                constructorType="stockChart"
                allowChartUpdate
                callback={setChart}
                options={{
                    chart: {
                        height: height > 40 ? (height - 40) : null, // 40px = RangeSelect toolbar height
                        reflow: false,
                    },
                    credits: {
                        enabled: false,
                    },
                    legend: {
                        enabled: true,
                    },
                    rangeSelector: {
                        enabled: false,
                    },
                    scrollbar: {
                        enabled: false,
                    },
                    series: series.map((s) => ({
                        ...s,
                        ...seriesData[s.idx],
                        id: `series-${s.idx}`,
                    })),
                    time: {
                        timezoneOffset: new Date().getTimezoneOffset(),
                    },
                }}
            />
        </div>
    )
}

export default Chart
