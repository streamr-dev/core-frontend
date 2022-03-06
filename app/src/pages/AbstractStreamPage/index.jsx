import React from 'react'
import { useParams } from 'react-router-dom'
import StreamIdContext from './contexts/StreamIdContext'
import StreamPermissionsProvider from './components/StreamPermissionsProvider'
import StreamProvider from './components/StreamProvider'

export default function AbstractStreamPage({ children }) {
    const { id } = useParams()

    const streamId = decodeURIComponent(id)

    return (
        <StreamIdContext.Provider value={streamId}>
            <StreamPermissionsProvider preload>
                <StreamProvider>
                    {children}
                </StreamProvider>
            </StreamPermissionsProvider>
        </StreamIdContext.Provider>
    )
}
