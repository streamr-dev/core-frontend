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

const ChartModule2 = (props) => {
    const { isActive, canvas, module } = props
    
    const subscriptionRef = useRef(null)

    const queuedDatapointsRef = useRef([])

    const [series, setSeries] = useState({})

    const [seriesData, setSeriesData] = useState({})

    const onSeries = useCallback((payload) => {
        const id = `series-${payload.idx}`

        setSeries((series) => ({
            ...series,
            [id]: {
                ...(series[id] || {}),
                ...payload,
                lineWidth: 1,
                marker: {
                    lineColor: undefined,
                    symbol: 'circle',
                },
                showInNavigator: true,
                id,
                xAxis: 0,
                yAxis: 0,
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

        setSeriesData((seriesData) => queued.reduce((memo, { s, x, y }) => ({
            ...memo,
            [s]: [
                ...(memo[s] || []),
                [x, y],
            ],
        }), seriesData))
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
        <UiSizeConstraint minWidth={300} minHeight={240}>
                <ModuleSubscription
                    {...props}
                    onActiveChange={init}
                    onMessage={onMessage}
                    ref={subscriptionRef}
                />
                <Chart
                    datapoints={seriesData}
                    options={module.options || {}}
                    series={series}
                />
        </UiSizeConstraint>
    )
}

export default ChartModule2
