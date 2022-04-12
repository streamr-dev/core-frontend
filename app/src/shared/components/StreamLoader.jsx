import { useEffect, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import { useStreamSetter } from '$shared/contexts/StreamSetterContext'
import useStreamId from '$shared/hooks/useStreamId'

export default function StreamLoader() {
    const client = useClient()

    const streamId = useStreamId()

    const setStream = useStreamSetter()

    const setStreamRef = useRef(setStream)

    useEffect(() => {
        setStreamRef.current = setStream
    }, [setStream])

    useEffect(() => {
        let aborted = false

        async function fn() {
            try {
                const remoteStream = await client.getStream(streamId)

                if (aborted || typeof setStreamRef.current !== 'function') {
                    return
                }

                setStreamRef.current(remoteStream)
            } catch (e) {
                console.warn(e)
            }
        }

        fn()

        return () => {
            aborted = true
        }
    }, [client, streamId])

    return null
}
