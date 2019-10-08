// @flow

import React, { useEffect, useState, useRef, useCallback } from 'react'
import StreamrClient from 'streamr-client'
import {
    XYPlot,
    LineSeries,
    XAxis,
    YAxis,
    HorizontalGridLines,
} from 'react-vis'
import '../../../../../node_modules/react-vis/dist/style.css'

import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'

type Props = {
    className?: string,
    joinPartStreamId: string,
    authApiKeyId: ?ResourceKeyId,
    memberCount: number,
    shownDays: number,
}

const getDiffCoefficient = (type) => {
    if (type === 'join') {
        return 1
    } else if (type === 'part') {
        return -1
    }
    return 0
}

const getResendOptions = (resendDays) => {
    const fromDate = Date.now() - (resendDays * 24 * 60 * 60 * 1000)
    return {
        resend: {
            from: {
                timestamp: fromDate,
            },
        },
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

const MembersGraph = ({
    className,
    joinPartStreamId,
    authApiKeyId,
    memberCount,
    shownDays,
}: Props) => {
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])

    const clientRef = useRef()
    const subscriptionRef = useRef()

    const onMessage = useCallback((data, metadata) => {
        const entry = {
            timestamp: metadata.messageId.timestamp,
            diff: data.addresses.length * getDiffCoefficient(data.type),
        }
        setMemberData((oldArray) => [
            ...oldArray,
            entry,
        ])
    }, [])

    const createClient = useCallback((authKey) => {
        const client = new StreamrClient({
            url: process.env.STREAMR_WS_URL,
            restUrl: process.env.STREAMR_API_URL,
            auth: {
                apiKey: authKey || undefined,
            },
            autoConnect: true,
            autoDisconnect: false,
        })
        return client
    }, [])

    const subscribe = useCallback((client, streamId: string) => {
        setMemberData([])
        const sub = client.subscribe({
            stream: streamId,
            ...getResendOptions(shownDays),
        }, (data, metadata) => {
            onMessage(data, metadata)
        })
        return sub
    }, [onMessage, shownDays])

    useEffect(() => {
        const client = createClient(authApiKeyId)
        clientRef.current = client
    }, [authApiKeyId, createClient])

    useEffect(() => {
        if (clientRef.current) {
            const sub = subscribe(clientRef.current, joinPartStreamId)
            subscriptionRef.current = sub
        }
    }, [joinPartStreamId, clientRef, subscribe])

    useEffect(() => {
        memberData.sort((a, b) => b.timestamp - a.timestamp)
        const initialData = [{
            x: memberCountUpdatedAt,
            y: memberCount,
        }]
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

    return (
        <div className={className}>
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
