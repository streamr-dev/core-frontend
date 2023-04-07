import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentAbility } from '$shared/stores/abilities'
import { StreamConnect } from "$shared/components/StreamConnect"
import useDecodedStreamId from "$shared/hooks/useDecodedStreamId"
import StreamPage from './StreamPage'
import { StreamDraftContext, useInitStreamDraft } from '../shared/stores/streamEditor'

function UnwrappedStreamConnectPage() {
    const streamId = useDecodedStreamId()

    const loading = typeof useCurrentAbility(StreamPermission.EDIT) === 'undefined'

    return (
        <StreamPage loading={loading} showSaveButton={false} fullWidth>
            <StreamConnect streams={[streamId]}/>
        </StreamPage>
    )
}

export default function StreamConnectPage() {
    return (
        <StreamDraftContext.Provider value={useInitStreamDraft(useDecodedStreamId())}>
            <UnwrappedStreamConnectPage />
        </StreamDraftContext.Provider>
    )
}
