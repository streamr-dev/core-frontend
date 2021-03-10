// @flow

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useSubscription } from 'streamr-client-react'

import ClientProvider from '$shared/components/StreamrClientProvider'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import useIsMounted from '$shared/hooks/useIsMounted'

type Props = {
    joinPartStreamId: ?string,
    memberCount: number,
    shownDays?: number,
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

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const MembersGraph = ({ joinPartStreamId, memberCount, shownDays = 7 }: Props) => {
    const isMounted = useIsMounted()
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])
    const activeAddressesRef = useRef([])

    const resendFrom = useMemo(() => (
        Date.now() - (shownDays * MILLISECONDS_IN_DAY)
    ), [shownDays])

    const onMessage = useCallback((data: JoinPartMessage, metadata: MessageMetadata) => {
        if (!isMounted()) { return }

        let diff = 0
        const activeAddresses = activeAddressesRef.current
        let msgAddresses = data.addresses

        // Sometimes data.addresses is not an array but raw string instead.
        // Correct this to be an array.
        if ((data.type === 'join' || data.type === 'part') && !Array.isArray(msgAddresses)) {
            msgAddresses = [((data.addresses: any): string)]
        }

        // Check if message type is 'join' or 'part' and
        // calculate member count diff based on the type.
        // E.g. 'join' with 3 addresses means +3 diff in member count.
        // JoinPartStream might have duplicate joins/parts for a
        // single address so make sure we skip duplicates.
        if (data.type === 'join' && msgAddresses && msgAddresses.length > 0) {
            msgAddresses.forEach((address) => {
                if (!activeAddresses.includes(address)) {
                    diff += 1
                    activeAddresses.push(address)
                }
            })
        } else if (data.type === 'part' && msgAddresses && msgAddresses.length > 0) {
            msgAddresses.forEach((address) => {
                if (activeAddresses.includes(address)) {
                    diff -= 1
                    const addrIndex = activeAddresses.indexOf(address)
                    if (addrIndex > -1) {
                        activeAddresses.splice(addrIndex, 1)
                    }
                }
            })
        } else {
            // Reject other message types.
            return
        }

        if (diff !== 0) {
            const entry = {
                timestamp: metadata.messageId.timestamp,
                diff,
            }
            setMemberData((oldArray) => [
                ...oldArray,
                entry,
            ])
        }
    }, [isMounted])

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
            x: Date.now() - (shownDays * MILLISECONDS_IN_DAY),
            y: latestMemberCount,
        })
        setGraphData(data)
    }, [memberData, memberCount, memberCountUpdatedAt, shownDays])

    useEffect(() => {
        setMemberCountUpdatedAt(Date.now())
    }, [memberCount])

    useEffect(() => {
        // Clear member data when we change shownDays because
        // resubscription to stream will happen and data will
        // be resent
        setMemberData([])
        activeAddressesRef.current = []
    }, [shownDays, joinPartStreamId, onMessage])

    useSubscription({
        stream: joinPartStreamId,
        resend: {
            from: {
                timestamp: resendFrom,
            },
        },
    }, {
        onMessage,
    })

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
            <MembersGraph {...props} />
        </ClientProvider>
    )
}
