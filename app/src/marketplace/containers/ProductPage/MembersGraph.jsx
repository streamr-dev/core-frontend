// @flow

import React, { useEffect, useState, useCallback, useRef } from 'react'
import MediaQuery from 'react-responsive'

import { lg } from '$app/scripts/breakpoints'
import { getStreamData } from '$mp/modules/streams/services'

import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import WithShownDays from '$shared/components/TimeSeriesGraph/WithShownDays'

type Props = {
    className?: string,
    joinPartStreamId: ?string,
    memberCount: number,
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

const MembersGraph = ({ className, joinPartStreamId, memberCount }: Props) => {
    const [memberCountUpdatedAt, setMemberCountUpdatedAt] = useState(Date.now())
    const [memberData, setMemberData] = useState([])
    const [graphData, setGraphData] = useState([])
    const [shownDays, setShownDays] = useState(7)
    const activeAddressesRef = useRef([])

    const onMessage = useCallback((data: JoinPartMessage, metadata: MessageMetadata) => {
        let diff = 0
        const activeAddresses = activeAddressesRef.current

        // Check if message type is 'join' or 'part' and
        // calculate member count diff based on the type.
        // E.g. 'join' with 3 addresses means +3 diff in member count.
        // JoinPartStream might have duplicate joins/parts for a
        // single address so make sure we skip duplicates.
        if (data.type === 'join' && data.addresses && data.addresses.length > 0) {
            data.addresses.forEach((address) => {
                if (!activeAddresses.includes(address)) {
                    diff += 1
                    activeAddresses.push(address)
                }
            })
        } else if (data.type === 'part' && data.addresses && data.addresses.length > 0) {
            data.addresses.forEach((address) => {
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
                y: acc[index].y - element.diff,
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
        <MediaQuery maxWidth={lg.max}>
            {(isTabletOrMobile: boolean) => (
                <WithShownDays
                    label="Members"
                    className={className}
                    onDaysChange={(days) => setShownDays(days)}
                >
                    {({ shownDays: days }) => (
                        <TimeSeriesGraph
                            graphData={graphData}
                            shownDays={days}
                            width={isTabletOrMobile ? 380 : 540}
                            height={200}
                        />
                    )}
                </WithShownDays>
            )}
        </MediaQuery>
    )
}

export default MembersGraph
