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
import Subscription from '$editor/shared/components/Subscription'
import { ClientProvider } from '$editor/shared/components/Client'

type Props = {
    className?: string,
    joinPartStreamId: string,
    memberCount: number,
    shownDays: number,
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

const MembersGraph = ({ className, joinPartStreamId, memberCount, shownDays }: Props) => {
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])

    const onMessage = useCallback((data, metadata) => {
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
        setGraphData(data)
    }, [memberData, memberCount, memberCountUpdatedAt])

    useEffect(() => {
        setMemberCountUpdatedAt(Date.now())
    }, [memberCount])

    useEffect(() => {
        // Clear member data when we change shownDays because
        // resubscription to stream will happen and data will
        // be resent
        setMemberData([])
    }, [shownDays])

    return (
        <div className={className}>
            <ClientProvider>
                <Subscription
                    key={`${joinPartStreamId}-${shownDays}`}
                    uiChannel={{
                        id: joinPartStreamId,
                    }}
                    resendFrom={Date.now() - (shownDays * MILLISECONDS_IN_DAY)}
                    onMessage={onMessage}
                    isActive
                />
            </ClientProvider>
            <XYPlot
                xType="time"
                width={540}
                height={200}
                margin={{
                    left: 0,
                    right: 50,
                }}
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
