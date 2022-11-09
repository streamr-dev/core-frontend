import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'streamr-client-react'
import { StatusIcon } from '@streamr/streamr-layout'
import useStreamId from '$shared/hooks/useStreamId'

export default function useStreamActivityStatus(inactivityThresholdHours, { cache = 0 } = {}) {
    const [timestamp, setTimestamp] = useState()
    const client = useClient({
        auth: {
            // Use a throwaway private key to authenticate and allow read-only mode.
            // This will get rid of MetaMask sign popups that are needed for group key exchange.
            privateKey: '531479d5645596f264e7e3cbe80c4a52a505d60fad45193d1f6b8e4724bf0304',
        },
    })
    const streamId = useStreamId()

    useEffect(() => {
        if (!streamId) {
            return () => {}
        }

        let aborted = false

        async function fn() {
            try {
                await client.resend(
                    streamId,
                    {
                        last: 1,
                    },
                    (content: any, metadata: any) => {
                        const ts = (metadata || {}).messageId.timestamp
                        if (!aborted) {
                            setTimestamp(ts)
                        }
                    }, {
                        resend: 1,
                    }
                )
            } catch (e) {
                // Noop.
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

        if (Date.now() - inactivityThresholdHours * 60 * 60 * 1000 < timestamp) {
            return [StatusIcon.OK, timestamp]
        }

        return [StatusIcon.ERROR, timestamp]
    }, [timestamp, inactivityThresholdHours])
}
