// @flow

import React, { useEffect, useState, useCallback } from 'react'
import {
    XYPlot,
    LineSeries,
    XAxis,
    YAxis,
    HorizontalGridLines,
} from 'react-vis'
import '$app/node_modules/react-vis/dist/style.css'
// import Subscription from '$editor/shared/components/Subscription'
// import { ClientProvider } from '$editor/shared/components/Client'
import { getStreamData } from '$mp/modules/communityProduct/services'

type Props = {
    className?: string,
    joinPartStreamId: ?string,
    memberCount: number,
    shownDays: number,
}

type JoinPartMessage = {
    type: string,
    addresses: Array<string>,
}

type MessageMetadata = {
    messageId: {
        timestamp: number,
    }
}

const axisStyle = {
    ticks: {
        fontSize: '12px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: '#A3A3A3',
        strokeOpacity: '0',
        opacity: '0.5',
        letterSpacing: '0px',
    },
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

// Converts raw messages from the HTTP api to match format we get with
// streamr-client. Contains only payload and needed parts of the metadata.
const convertAndCallback = (rawMessages: Array<Object>, onMessage) => {
    rawMessages.forEach((msg) => {
        const data = JSON.parse(msg[5])
        const metaData = {
            messageId: {
                timestamp: msg[1][2],
            },
        }
        onMessage(data, metaData)
    })
}

const formatXAxisTicks = (value, index, scale, tickTotal, dayCount) => {
    if (dayCount < 10) {
        return scale.tickFormat(tickTotal, '%a %d')(value)
    }

    // Include month only for the first item and when month
    // changes.
    if (index === 0 || value.getDate() === 1) {
        return scale.tickFormat(tickTotal, '%b %d')(value)
    }
    // Otherwise return only day number
    return scale.tickFormat(tickTotal, '%d')(value)
}

const MembersGraph = ({ className, joinPartStreamId, memberCount, shownDays }: Props) => {
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])
    const [dataDomain, setDataDomain] = useState([])

    const onMessage = useCallback((data: JoinPartMessage, metadata: MessageMetadata) => {
        // Check if message type is 'join' or 'part' and
        // calculate member count diff based on the type.
        // E.g. 'join' with 3 addresses means +3 diff in member count.
        let diffCoefficient = 0
        if (data.type === 'join') {
            diffCoefficient = 1
        } else if (data.type === 'part') {
            diffCoefficient = -1
        } else {
            // Reject other message types.
            return
        }

        const entry = {
            timestamp: metadata.messageId.timestamp,
            diff: data.addresses.length * diffCoefficient,
        }
        setMemberData((oldArray) => [
            ...oldArray,
            entry,
        ])
    }, [])

    useEffect(() => {
        memberData.sort((a, b) => b.timestamp - a.timestamp)

        // Only thing we know at the beginning is total member count
        // at given timestamp.
        const initialData = [{
            x: memberCountUpdatedAt,
            y: memberCount,
        }]

        // Because we cannot read the whole joinPartStream, we have to
        // work backwards from the initial state and calculate graph points
        // using the member count diff.
        const data = memberData.reduce((acc, element, index) => {
            acc.push({
                x: element.timestamp,
                y: acc[index].y + element.diff,
            })
            return acc
        }, initialData)

        // If there's only 1 data point, "extrapolate"
        // data to have 2 points so that we can draw
        // a line between them.
        if (data.length === 1) {
            data.push({
                x: data[0].x - (shownDays * MILLISECONDS_IN_DAY),
                y: data[0].y,
            })
        }
        setGraphData(data)

        const dataValues = data.map((d) => d.y)
        let max = Math.max(...dataValues)
        let min = Math.min(...dataValues)

        // If we provide a domain with same min and max, react-vis
        // shows seemingly random scale for y-axis
        if (max === min) {
            min -= 2
            max += 2
        }
        setDataDomain([min - 2, max])
    }, [memberData, memberCount, memberCountUpdatedAt, shownDays])

    useEffect(() => {
        setMemberCountUpdatedAt(Date.now())
    }, [memberCount])

    useEffect(() => {
        // Clear member data when we change shownDays because
        // resubscription to stream will happen and data will
        // be resent
        setMemberData([])

        const loadStreamData = async (streamId) => {
            const from = Date.now() - (shownDays * MILLISECONDS_IN_DAY)
            const rawData = await getStreamData(streamId, from)
            convertAndCallback(rawData, onMessage)
        }

        if (joinPartStreamId) {
            loadStreamData(joinPartStreamId)
        }
    }, [shownDays, joinPartStreamId, onMessage])

    return (
        <div className={className}>
            {/*
            // Disabled for now because resends are super flaky at the moment
            <ClientProvider>
                {joinPartStreamId && (
                    <Subscription
                        key={`${joinPartStreamId}-${shownDays}`}
                        uiChannel={{
                            id: joinPartStreamId,
                        }}
                        resendFrom={Date.now() - (shownDays * MILLISECONDS_IN_DAY)}
                        onMessage={onMessage}
                        isActive
                    />
                )}
            </ClientProvider>
            */}
            <XYPlot
                xType="time"
                width={540}
                height={200}
                /* We need margin to not clip axis labels */
                margin={{
                    left: 10,
                    right: 50,
                }}
                yDomain={dataDomain}
            >
                <HorizontalGridLines />
                <LineSeries
                    curve={null}
                    color="#0324FF"
                    opacity={1}
                    strokeStyle="solid"
                    strokeWidth="4"
                    data={graphData}
                />
                <XAxis
                    hideLine
                    style={axisStyle}
                    tickTotal={7}
                    tickFormat={(value, index, scale, tickTotal) => formatXAxisTicks(value, index, scale, tickTotal, shownDays)}
                />
                <YAxis
                    hideLine
                    style={axisStyle}
                    position="start"
                    orientation="right"
                />
            </XYPlot>
        </div>
    )
}

export default MembersGraph
