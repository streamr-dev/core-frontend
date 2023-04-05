import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentAbility } from '$shared/stores/abilities'
import { StreamConnect } from "$shared/components/StreamConnect"
import useDecodedStreamId from "$shared/hooks/useDecodedStreamId"
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'

function UnwrappedStreamEditPage() {
    const streamId = useDecodedStreamId()

    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const loading = typeof canEdit === 'undefined'

    return (
        <StreamPage loading={loading} showSaveButton={false} fullWidth>
            <StreamConnect streams={[streamId]}/>
        </StreamPage>
    )
}

export default function StreamConnectPage() {
    return (
        <AbstractStreamPage>
            <StreamModifier>
                <UnwrappedStreamEditPage />
            </StreamModifier>
        </AbstractStreamPage>
    )
}
