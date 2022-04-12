import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'streamr-client-react'
import { StatusIcon } from '@streamr/streamr-layout'
import useStreamId from '$shared/hooks/useStreamId'

export default function useStreamActivityStatus(inactivityThresholdHours) {
    const [timestamp, setTimestamp] = useState()

    const client = useClient()

    const streamId = useStreamId()

    useEffect(() => {
        if (!streamId) {
            return () => {}
        }

        let aborted = false

        async function fn() {
            let ts = -1

            try {
                const [message] = await client.getStreamLast(streamId)
                ts = (message || {}).timestamp
            } catch (e) {
                if (/not_found/i.test(e.message)) {
                    ts = undefined
                }
            }

            if (!aborted) {
                setTimestamp(ts)
            }
        }

        fn()

        return () => {
            aborted = true
        }
    }, [client, streamId])

    return useMemo(() => {
        if (!timestamp || typeof inactivityThresholdHours === 'undefined') {
            return StatusIcon.INACTIVE
        }

        if (timestamp === -1) {
            return StatusIcon.ERROR
        }

        if (Date.now() - (inactivityThresholdHours * 60 * 60 * 1000) < timestamp) {
            return StatusIcon.OK
        }

        return StatusIcon.INACTIVE
    }, [timestamp, inactivityThresholdHours])
}
