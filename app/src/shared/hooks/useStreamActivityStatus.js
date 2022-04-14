import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'streamr-client-react'
import { StatusIcon } from '@streamr/streamr-layout'
import useStreamId from '$shared/hooks/useStreamId'

export default function useStreamActivityStatus(inactivityThresholdHours, { cache = 0 } = {}) {
    const [timestamp, setTimestamp] = useState()

    const client = useClient()

    const streamId = useStreamId()

    useEffect(() => {
        if (!streamId) {
            return () => {}
        }

        let aborted = false

        async function fn() {
            let ts

            try {
                const [message] = await client.getStreamLast(streamId)
                ts = (message || {}).timestamp
            } catch (e) {
                // Noop.
            }

            if (!aborted) {
                setTimestamp(ts)
            }
        }

        fn()

        return () => {
            aborted = true
        }
    }, [client, streamId, cache])

    return useMemo(() => {
        if (!timestamp || typeof inactivityThresholdHours === 'undefined') {
            return [StatusIcon.INACTIVE, timestamp]
        }

        if (Date.now() - (inactivityThresholdHours * 60 * 60 * 1000) < timestamp) {
            return [StatusIcon.OK, timestamp]
        }

        return [StatusIcon.ERROR, timestamp]
    }, [timestamp, inactivityThresholdHours])
}
