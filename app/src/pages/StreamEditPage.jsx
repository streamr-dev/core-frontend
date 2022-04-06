import React from 'react'
import { StreamPermission } from 'streamr-client'
import StreamModifier from '$shared/components/StreamModifier'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'

export default function StreamCreatePage() {
    return (
        <AbstractStreamPage
            streamOperations={[
                StreamPermission.EDIT,
                StreamPermission.GRANT,
                StreamPermission.SUBSCRIBE,
            ]}
        >
            <StreamModifier>
                <StreamPage />
            </StreamModifier>
        </AbstractStreamPage>
    )
}
