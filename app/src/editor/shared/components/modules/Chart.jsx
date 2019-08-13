import React, { useRef, useCallback, useState, useEffect } from 'react'
import throttle from 'lodash/throttle'

import useIsMounted from '$shared/hooks/useIsMounted'
import Chart from '$editor/shared/components/Chart'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import UiSizeConstraint from '../UiSizeConstraint'

const ChartModule2 = (props) => {
    const { isActive, module } = props

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
    }, [setSeries])

    const isMounted = useIsMounted()

    const flushDatapointsRef = useRef(throttle(() => {
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
    }, 250))

    const onDatapoint = useCallback((payload) => {
        queuedDatapointsRef.current.push(payload)
        flushDatapointsRef.current()
    }, [flushDatapointsRef, queuedDatapointsRef])

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
    }, [onDatapoint, onSeries])

    const onSeriesRef = useRef()
    onSeriesRef.current = onSeries

    const init = useCallback(async () => {
        const { current: subscription } = subscriptionRef

        if (!subscription || !isActive) { return }

        const { initRequest: { series } } = await subscription.send({
            type: 'initRequest',
        })

        if (!isMounted()) { return }
        series.forEach(onSeriesRef.current)
    }, [onSeriesRef, subscriptionRef, isActive, isMounted])

    const initRef = useRef()
    initRef.current = init
    useEffect(() => {
        // Run init onMount. Ignore further updates.
        initRef.current()
    }, [initRef])

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
