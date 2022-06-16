// @flow

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import { getJoinsAndParts } from '$mp/modules/dataUnion/services'

type Props = {
    dataUnionAddress: string,
    chainId: number,
    memberCount: number,
    shownDays?: number,
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const MembersGraph = ({ dataUnionAddress, chainId, memberCount, shownDays = 7 }: Props) => {
    const isMounted = useIsMounted()
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])
    const generator = useRef(null)

    const startDate = useMemo(() => (
        Date.now() - (shownDays * MILLISECONDS_IN_DAY)
    ), [shownDays])

    const reset = useCallback(() => {
        setGraphData([])
        setMemberData([])
    }, [])

    useEffect(() => {
        setMemberCountUpdatedAt(Date.now())
    }, [memberCount])

    useEffect(() => {
        const loadData = async () => {
            try {
                if (generator.current != null) {
                    generator.current.return('Canceled')
                    generator.current = null
                    reset()
                }
                generator.current = getJoinsAndParts(dataUnionAddress, chainId, startDate)

                // eslint-disable-next-line no-restricted-syntax
                for await (const event of generator.current) {
                    if (isMounted()) {
                        setMemberData((prev) => [
                            ...prev,
                            event,
                        ])
                    }
                }
            } catch (e) {
                console.warn(e)
            }
        }

        if (dataUnionAddress) {
            loadData()
        }
    }, [dataUnionAddress, chainId, startDate, reset, isMounted])

    useEffect(() => () => {
        // Cancel generator on unmount
        if (generator.current != null) {
            generator.current.return('Canceled')
            generator.current = null
        }
    }, [])

    useEffect(() => {
        memberData.sort((a, b) => b.timestamp - a.timestamp)

        // Only thing we know at the beginning is total member count
        // at given timestamp.
        const initialData = [{
            x: memberCountUpdatedAt,
            y: memberCount,
        }]

        // Because we cannot read every event from blockchain, we have to
        // work backwards from the initial state and calculate graph points
        // using the member count diff.
        const data = memberData.reduce((acc, element) => {
            const latestValue = acc[acc.length - 1]
            // Add a superficial datapoint with "old" count
            // to happen 1ms before actual one to form a
            // "staircase" graph
            acc.push({
                x: element.timestamp + 1,
                y: latestValue.y,
            })
            acc.push({
                x: element.timestamp,
                y: latestValue.y - element.diff,
            })
            return acc
        }, initialData)

        const latestMemberCount = data[data.length - 1].y

        // Make sure we fill the whole date range
        data.push({
            x: startDate,
            y: latestMemberCount,
        })
        setGraphData(data)
    }, [memberData, memberCount, memberCountUpdatedAt, startDate])

    return (
        <TimeSeriesGraph
            graphData={graphData}
            shownDays={shownDays}
        />
    )
}

export default MembersGraph
