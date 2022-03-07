import React from 'react'
import useDecodedStreamId from '$shared/hooks/useDecodedStreamId'
import StreamIdContext from './contexts/StreamIdContext'
import StreamPermissionsProvider from './components/StreamPermissionsProvider'
import StreamProvider from './components/StreamProvider'

export default function AbstractStreamPage({ children, streamOperations }) {
    const streamId = useDecodedStreamId()

    return (
        <StreamIdContext.Provider value={streamId}>
            <StreamPermissionsProvider preload operations={streamOperations}>
                <StreamProvider>
                    {children}
                </StreamProvider>
            </StreamPermissionsProvider>
        </StreamIdContext.Provider>
    )
}
