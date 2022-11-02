import React, { useState } from 'react'
import StreamContext from '$shared/contexts/StreamContext'
import StreamIdContext from '$shared/contexts/StreamIdContext'
import StreamLoader from '$shared/components/StreamLoader'
import StreamPermissionsProvider from '$shared/components/StreamPermissionsProvider'
import useDecodedStreamId from '$shared/hooks/useDecodedStreamId'
import StreamSetterContext from '$shared/contexts/StreamSetterContext'

type Props = {
    streamOperations?: Array<any>,
    children?: React.ReactNode,
}

export default function AbstractStreamPage({ streamOperations, children }: Props) {
    const streamId = useDecodedStreamId()
    const [stream, setStream] = useState()
    return (
        <StreamIdContext.Provider value={streamId}>
            <StreamSetterContext.Provider value={setStream}>
                <StreamPermissionsProvider preload operations={streamOperations}>
                    <StreamLoader />
                    <StreamContext.Provider value={stream}>{children}</StreamContext.Provider>
                </StreamPermissionsProvider>
            </StreamSetterContext.Provider>
        </StreamIdContext.Provider>
    )
}
