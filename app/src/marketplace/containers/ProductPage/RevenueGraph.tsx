// @flow

import React, { useEffect, useState, useMemo, useCallback } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import { getDataUnionStatistics } from '$mp/modules/dataUnion/services'
import { fromDecimals } from '$mp/utils/math'

type Props = {
    dataUnionAddress: string,
    chainId: number,
    currentRevenue: number,
    shownDays?: number,
    pricingTokenDecimals: number,
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const RevenueGraph = ({
    dataUnionAddress,
    chainId,
    currentRevenue,
    pricingTokenDecimals,
    shownDays = 7,
}: Props): React.FC<Props> => {
    const isMounted = useIsMounted()
    const [revenueData, setRevenueData] = useState([])
    const [graphData, setGraphData] = useState([])
    const currentRevenueInTokens = fromDecimals(currentRevenue, pricingTokenDecimals).toNumber()

    const startDate = useMemo(() => (
        Date.now() - (shownDays * MILLISECONDS_IN_DAY)
    ), [shownDays])

    const reset = useCallback(() => {
        setGraphData([])
        setRevenueData([])
    }, [])

    useEffect(() => {
        const loadData = async () => {
            try {
                const statistics = await getDataUnionStatistics(dataUnionAddress, chainId, startDate)
                if (isMounted()) {
                    setRevenueData(statistics)
                }
            } catch (e) {
                console.warn(e)
            }
        }

        if (dataUnionAddress) {
            loadData()
        }
    }, [dataUnionAddress, chainId, startDate, reset, isMounted, currentRevenueInTokens])

    useEffect(() => {
        const data = []

        // eslint-disable-next-line no-restricted-syntax
        for (const val of revenueData) {
            data.push({
                x: val.startDate * 1000,
                y: fromDecimals(val.revenueAtStartWei, pricingTokenDecimals),
            })
            // Add a superficial datapoint to form a staircase graph
            data.push({
                x: (val.endDate * 1000) - 1,
                y: fromDecimals(val.revenueAtStartWei + val.revenueChangeWei, pricingTokenDecimals),
            })
        }

        // Make sure we fill the whole date range (end)
        if (data.length === 0) {
            data.push({
                x: Date.now(),
                y: currentRevenueInTokens,
            })
        } else {
            const lastRevenue = data[data.length - 1].y
            data.push({
                x: Date.now(),
                y: lastRevenue,
            })
        }

        if (data.length > 0) {
            const firstRevenue = data[0].y

            // Make sure we fill the whole date range (start)
            data.unshift({
                x: startDate,
                y: firstRevenue,
            })
        }

        setGraphData(data)
    }, [revenueData, currentRevenueInTokens, startDate, pricingTokenDecimals])

    return (
        <TimeSeriesGraph
            graphData={graphData}
            shownDays={shownDays}
        />
    )
}

export default RevenueGraph
