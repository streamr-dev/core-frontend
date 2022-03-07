import React, { useEffect, useState } from 'react'
import { StreamPermission } from 'streamr-client'
import { useClient } from 'streamr-client-react'
import StreamContext from '$shared/contexts/StreamContext'
import useStreamId from '$shared/hooks/useStreamId'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'

export default function StreamProvider({ children }) {
    const streamId = useStreamId()

    const { [StreamPermission.SUBSCRIBE]: canSubscribe } = useStreamPermissions()

    const [stream, setStream] = useState(undefined)

    const client = useClient()

    useEffect(() => {
        setStream(undefined)
    }, [streamId])

    useEffect(() => {
        let aborted = false

        async function fn() {
            try {
                // `streamId` is known. `fn` gets called only when `canSubscribe` is true, meaning
                // we successfully loaded permissions using the `streamId`.
                const remoteStream = await client.getStream(streamId)

                if (aborted) {
                    return
                }

                setStream(remoteStream)
            } catch (e) {
                console.error(e)
            }
        }

        if (canSubscribe === true) {
            fn()
        }

        return () => {
            aborted = true
        }
    }, [client, streamId, canSubscribe])

    return (
        <StreamContext.Provider value={stream}>
            {children}
        </StreamContext.Provider>
    )
}
