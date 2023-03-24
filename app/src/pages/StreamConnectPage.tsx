import React from 'react'
import { StreamPermission } from 'streamr-client'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import {StreamConnect} from "$shared/components/StreamConnect"
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import useDecodedStreamId from "$shared/hooks/useDecodedStreamId"
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'

function UnwrappedStreamEditPage() {
    const { busy } = useStreamModifierStatusContext()
    const { [StreamPermission.EDIT]: canEdit } = useStreamPermissions()
    const loading = typeof canEdit === 'undefined'
    const streamId = useDecodedStreamId()
    return (
        <StreamPage loading={loading} showSaveButton={false} fullWidth>
            <StreamConnect streams={[streamId]}/>
        </StreamPage>
    )
}

export default function StreamConnectPage() {
    return (
        <AbstractStreamPage
            streamOperations={[StreamPermission.EDIT, StreamPermission.GRANT, StreamPermission.SUBSCRIBE]}
        >
            <StreamModifier>
                <UnwrappedStreamEditPage />
            </StreamModifier>
        </AbstractStreamPage>
    )
}
