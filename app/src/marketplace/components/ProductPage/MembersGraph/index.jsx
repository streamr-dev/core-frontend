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

const MembersGraph = ({ className, joinPartStreamId, authApiKeyId, memberCount }: Props) => {
    const [shownDays, setShownDays] = useState(7)
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])

    const clientRef = useRef()
    const subscriptionRef = useRef()

    const onMessage = useCallback((data, metadata) => {
        console.log('Got data from stream:', data, metadata)
        const entry = {
            timestamp: metadata.messageId.timestamp,
            diff: data.addresses.length * (data.type === 'join' ? 1 : -1),
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
        console.log('Created streamr-client')
        return client
    }, [])

    const subscribe = useCallback((client, streamId) => {
        // get 90 days of data
        // const fromDate = Date.now() - (90 * 24 * 60 * 60 * 1000)
        const sub = client.subscribe({
            stream: streamId,
            resend: {
                last: 100,
                /*
                from: {
                    timestamp: fromDate,
                },
                */
            },
        }, (data, metadata) => {
            onMessage(data, metadata)
        })
        console.log('Subscribed to', streamId)
        return sub
    }, [onMessage])

    useEffect(() => {
        const client = createClient(authApiKeyId)
        clientRef.current = client
    }, [authApiKeyId, createClient])

    useEffect(() => {
        if (clientRef.current) {
            const sub = subscribe(clientRef.current, joinPartStreamId)
            subscriptionRef.current = sub
        }

        setShownDays(7)
        /*
        setMemberData([
            {
                timestamp: new Date('2019-09-09T07:00:00').getTime(),
                diff: -1,
            },
            {
                timestamp: new Date('2019-09-05T07:00:00').getTime(),
                diff: 3,
            },
            {
                timestamp: new Date('2019-09-01T07:00:00').getTime(),
                diff: 1,
            },
        ])
        */
    }, [joinPartStreamId, clientRef, subscribe])

    useEffect(() => {
        memberData.sort((a, b) => b.timestamp - a.timestamp)
        const initialData = [{
            x: Date.now(),
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
    }, [memberData, memberCount])

    return (
        <XYPlot
            xType="time"
            width={570}
            height={200}
            margin={{
                left: 0,
                right: 50,
            }}
            className={className}
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
                /* tickFormat={(value, index, scale, tickTotal) => formatXAxisTicks(value, index, scale, tickTotal)} */
                tickTotal={shownDays}
            />
            <YAxis
                hideLine
                style={axisStyle}
                position="start"
                orientation="right"
            />
        </XYPlot>
    )
}

export default MembersGraph
