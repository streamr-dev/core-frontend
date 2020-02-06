// @flow

import React, { useEffect, useState } from 'react'
import MediaQuery from 'react-responsive'

import { lg } from '$app/scripts/breakpoints'
import { getSubscribedEvents } from '$mp/modules/contractProduct/services'

import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import WithShownDays from '$shared/components/TimeSeriesGraph/WithShownDays'

type Props = {
    className?: string,
    productId: string,
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const SubscriberGraph = ({ className, productId }: Props) => {
    const [graphData, setGraphData] = useState([])
    const [subscriptionData, setSubscriptionData] = useState([])
    const [shownDays, setShownDays] = useState(7)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getSubscriptions = async () => {
            setIsLoading(true)
            const fromTimestamp = Date.now() - (shownDays * MILLISECONDS_IN_DAY)
            const subscriptions = await getSubscribedEvents(productId, fromTimestamp)
            setSubscriptionData(subscriptions)
            setIsLoading(false)
        }
        getSubscriptions()
    }, [productId, shownDays])

    useEffect(() => {
        if (subscriptionData.length > 0) {
            const data = []
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
            const events = ([...subs, ...unsubs]).sort((a, b) => a.time - b.time)

            let subCount = 0
            events.forEach((e) => {
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
        }
    }, [subscriptionData])

    return (
        <MediaQuery maxWidth={lg.max}>
            {(isTabletOrMobile: boolean) => (
                <WithShownDays
                    label="Subscribers"
                    className={className}
                    onDaysChange={(days) => setShownDays(days)}
                >
                    {({ shownDays: days }) => (
                        <TimeSeriesGraph
                            graphData={graphData}
                            shownDays={days}
                            width={isTabletOrMobile ? 380 : 540}
                            height={200}
                            isLoading={isLoading}
                        />
                    )}
                </WithShownDays>
            )}
        </MediaQuery>
    )
}

export default SubscriberGraph
