// @flow

import React, { useEffect, useState, useMemo } from 'react'

import ClientProvider from '$shared/components/StreamrClientProvider'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import { getJoinsAndParts } from '$mp/modules/dataUnion/services'

type Props = {
    dataUnionAddress: string,
    memberCount: number,
    shownDays?: number,
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const MembersGraphV2 = ({ dataUnionAddress, memberCount, shownDays = 7 }: Props) => {
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])

    const startDate = useMemo(() => (
        Date.now() - (shownDays * MILLISECONDS_IN_DAY)
    ), [shownDays])

    useEffect(() => {
        setMemberCountUpdatedAt(Date.now())
    }, [memberCount])

    useEffect(() => {
        const loadData = async () => {
            const result = await getJoinsAndParts(dataUnionAddress, startDate)
            setMemberData(result)
        }

        if (dataUnionAddress) {
            loadData()
        }
    }, [dataUnionAddress, startDate])

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

export default function MembersGraphWrapper(props: Props) {
    return (
        <ClientProvider>
            <MembersGraphV2 {...props} />
        </ClientProvider>
    )
}
