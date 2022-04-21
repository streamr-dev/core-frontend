// @flow

import React, { useEffect, useState, useMemo } from 'react'
import { getSubscribedEvents } from '$mp/modules/contractProduct/services'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import useIsMounted from '$shared/hooks/useIsMounted'

type Props = {
    productId: string,
    shownDays?: number,
    chainId: number,
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const SubscriberGraph = ({ productId, shownDays = 7, chainId }: Props) => {
    const [graphData, setGraphData] = useState([])
    const [subscriptionData, setSubscriptionData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const isMounted = useIsMounted()

    const startDate = useMemo(() => (
        Date.now() - (shownDays * MILLISECONDS_IN_DAY)
    ), [shownDays])

    useEffect(() => {
        const getSubscriptions = async () => {
            setIsLoading(true)
            const subscriptions = await getSubscribedEvents(productId, startDate, true, chainId)
            if (isMounted) {
                setSubscriptionData(subscriptions)
                setIsLoading(false)
            }
        }
        getSubscriptions()
    }, [productId, chainId, isMounted, startDate])

    useEffect(() => {
        const data = []
        const subscriptions = subscriptionData || []

        const subs = subscriptions
            .filter((e) => e.start <= Date.now() && e.start >= startDate)
            .map((e) => ({
                time: e.start,
                type: 's', // s = subscription
            }))
        const unsubs = subscriptions
            .filter((e) => e.end <= Date.now() && e.end >= startDate)
            .map((e) => ({
                time: e.end,
                type: 'u', // u = unsubscription
            }))

        // Combine subscription and unsubscription events to a single array
        // ordered by event time
        const subscriptionEvents = ([...subs, ...unsubs]).sort((a, b) => a.time - b.time)

        if (subscriptionEvents.length === 0) {
            // Draw a zero line when there are no subscriptions
            data.push({
                x: startDate,
                y: 0,
            })
            data.push({
                x: Date.now(),
                y: 0,
            })
            setGraphData(data)
            return
        }

        let subCount = 0
        subscriptionEvents.forEach((e) => {
            // Add a superficial datapoint with "old" count
            // to happen 1ms before actual one to form a
            // "staircase" graph
            data.push({
                x: e.time - 1,
                y: subCount,
            })

            if (e.type === 's') {
                subCount += 1
            } else if (e.type === 'u') {
                subCount -= 1
            }

            // Push actual data point with new subscriber
            // count
            data.push({
                x: e.time,
                y: subCount,
            })
        })

        // Make sure we fill the whole date range
        if (data.length > 0) {
            data.unshift({
                x: startDate,
                y: data[0].y,
            })
            data.push({
                x: Date.now(),
                y: data[data.length - 1].y,
            })
        }

        setGraphData(data)
    }, [subscriptionData, startDate])

    return (
        <TimeSeriesGraph
            graphData={graphData}
            shownDays={shownDays}
            isLoading={isLoading}
        />
    )
}

export default SubscriberGraph
