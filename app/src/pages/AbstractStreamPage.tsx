import React, { useState } from 'react'
import StreamContext from '$shared/contexts/StreamContext'
import StreamIdContext from '$shared/contexts/StreamIdContext'
import StreamLoader from '$shared/components/StreamLoader'
import useDecodedStreamId from '$shared/hooks/useDecodedStreamId'
import StreamSetterContext from '$shared/contexts/StreamSetterContext'

type Props = {
    children?: React.ReactNode
}

export default function AbstractStreamPage({ children }: Props) {
    const streamId = useDecodedStreamId()

    const [stream, setStream] = useState()

    return (
        <StreamIdContext.Provider value={streamId}>
            <StreamSetterContext.Provider value={setStream}>
                <StreamLoader />
                <StreamContext.Provider value={stream}>{children}</StreamContext.Provider>
            </StreamSetterContext.Provider>
        </StreamIdContext.Provider>
    )
}
