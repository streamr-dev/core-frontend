import React from 'react'

import { StreamPermission } from 'streamr-client'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import {StreamPreview2} from '$shared/components/StreamPreview'
import useStreamId from '$shared/hooks/useStreamId'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'

function UnwrappedStreamEditPage() {
    const { [StreamPermission.EDIT]: canEdit, [StreamPermission.SUBSCRIBE]: canSubscribe } = useStreamPermissions()
    const loading = typeof canEdit === 'undefined'
    const streamId = useStreamId()

    return (
        <StreamPage loading={loading} includeContainerBox={false}>
            <StreamPreview2 streamsList={[streamId]} previewDisabled={!canSubscribe}/>
        </StreamPage>
    )
}

export default function StreamLiveDataPage() {
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
