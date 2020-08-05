import React, { useRef, useCallback, useState, useEffect } from 'react'
// import throttle from 'lodash/throttle'

import useIsMounted from '$shared/hooks/useIsMounted'
import Chart from '$editor/shared/components/Chart'
import ModuleSubscription from '$editor/shared/components/ModuleSubscription'
import UiSizeConstraint from '../UiSizeConstraint'
import useOnceEffect from '$shared/hooks/useOnceEffect'

const seriesId = (idx) => (
    `series-${idx}`
)

const updateSeriesCollection = (seriesCollection, { idx, ...series }) => {
    const id = seriesId(idx)

    seriesCollection[id] = {
        ...(seriesCollection[id] || {}),
        ...series,
        lineWidth: 1,
        marker: {
            lineColor: undefined,
            symbol: 'circle',
        },
        showInNavigator: true,
        id,
        idx,
        xAxis: 0,
        yAxis: 0,
        data: (seriesCollection[id] || {}).data || [],
        ready: true,
    }

    return {
        series: seriesCollection[id],
    }
}

const addSeriesDatapoint = (seriesCollection, { s: idx, x, y }) => {
    const id = seriesId(idx)

    const datapoint = [x, y]

    seriesCollection[id] = seriesCollection[id] || {
        data: [],
        id,
        idx,
        type: 's',
        ready: false,
    }

    seriesCollection[id].data.push(datapoint)

    return {
        series: seriesCollection[id],
        datapoint,
    }
}

const ChartModule2 = (props) => {
    const { isActive, module } = props

    const seriesCollectionRef = useRef({})

    const subscriptionRef = useRef(null)

    const isMounted = useIsMounted()

    const [chart, setChart] = useState(null)

    const onMessage = useCallback(({ type, ...payload }) => {
        let series

        let datapoint

        switch (type) {
            case 'p':
                ({ series, datapoint } = addSeriesDatapoint(seriesCollectionRef.current, payload))
                break
            case 's':
                ({ series } = updateSeriesCollection(seriesCollectionRef.current, payload))
                break
            default:
        }

        if (!chart || (type !== 'p' && type !== 's')) {
            return
        }

        const chartSeries = chart.get(series.id) || (series.ready ? chart.addSeries(series) : null)

        if (chartSeries && datapoint) {
            chartSeries.addPoint(datapoint)
        }
    }, [chart])

    useEffect(() => {
        Object.values(seriesCollectionRef.current).forEach(onMessage)
    }, [onMessage])

    const init = useCallback(async () => {
        const { current: subscription } = subscriptionRef

        if (!subscription || !isActive) { return }

        const { initRequest: { series } } = await subscription.send({
            type: 'initRequest',
        })

        if (!isMounted()) { return }

        series.forEach((s) => {
            onMessage({
                ...s,
                type: 's',
            })
        })
    }, [isActive, isMounted, onMessage])

    useOnceEffect(init)

    return (
        <UiSizeConstraint minWidth={300} minHeight={240}>
            <ModuleSubscription
                {...props}
                onActiveChange={init}
                onMessage={onMessage}
                ref={subscriptionRef}
            />
            <Chart
                options={module.options || {}}
                callback={setChart}
            />
        </UiSizeConstraint>
    )
}

export default ChartModule2
