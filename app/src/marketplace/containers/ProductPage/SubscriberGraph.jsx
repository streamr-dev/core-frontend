// @flow

import React, { useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'
import { lg } from '$app/scripts/breakpoints'
import { getSubscribedEvents } from '$mp/modules/contractProduct/services'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import useIsMounted from '$shared/hooks/useIsMounted'

type Props = {
    productId: string,
    shownDays?: number,
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const SubscriberGraph = ({ productId, shownDays = 7 }: Props) => {
    const [graphData, setGraphData] = useState([])
    const [subscriptionData, setSubscriptionData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const isMounted = useIsMounted()

    useEffect(() => {
        const getSubscriptions = async () => {
            setIsLoading(true)
            const fromTimestamp = Date.now() - (shownDays * MILLISECONDS_IN_DAY)
            const subscriptions = await getSubscribedEvents(productId, fromTimestamp)
            if (isMounted) {
                setSubscriptionData(subscriptions)
                setIsLoading(false)
            }
        }
        getSubscriptions()
    }, [productId, shownDays, isMounted])

    useEffect(() => {
        const data = []

        if (subscriptionData == null || subscriptionData.length === 0) {
            // Draw a zero line when there are no subscriptions
            data.push({
                x: Date.now() - (shownDays * MILLISECONDS_IN_DAY),
                y: 0,
            })
            data.push({
                x: Date.now(),
                y: 0,
            })
            setGraphData(data)
            return
        }

        const subs = subscriptionData
            .filter((e) => e.start <= Date.now())
            .map((e) => ({
                time: e.start,
                type: 's', // s = subscription
            }))
        const unsubs = subscriptionData
            .filter((e) => e.end <= Date.now())
            .map((e) => ({
                time: e.end,
                type: 'u', // u = unsubscription
            }))

        // Combine subscription and unsubscription events to a single array
        // ordered by event time
        const subscriptionEvents = ([...subs, ...unsubs]).sort((a, b) => a.time - b.time)

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

        setGraphData(data)
    }, [subscriptionData, shownDays])

    return (
        // TODO(mariusz): MediaQuery really needed!?
        <MediaQuery maxWidth={lg.max}>
            {(isTabletOrMobile: boolean) => (
                <TimeSeriesGraph
                    graphData={graphData}
                    shownDays={shownDays}
                    width={isTabletOrMobile ? 380 : 540}
                    height={200}
                    isLoading={isLoading}
                />
            )}
        </MediaQuery>
    )
}

export default SubscriberGraph
