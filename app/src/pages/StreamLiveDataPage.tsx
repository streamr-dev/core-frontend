import React from 'react'

import { StreamPermission } from 'streamr-client'
import { StreamPreview } from '$shared/components/StreamPreview'
import { useCurrentAbility } from '../shared/stores/abilities'
import useStreamId from '$shared/hooks/useStreamId'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'

function UnwrappedStreamEditPage() {
    const streamId = useStreamId()

    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const canSubscribe = useCurrentAbility(StreamPermission.SUBSCRIBE)

    const loading = typeof canEdit === 'undefined'

    return (
        <StreamPage loading={loading} includeContainerBox={false}>
            <StreamPreview streamsList={[streamId]} previewDisabled={!canSubscribe} />
        </StreamPage>
    )
}

export default function StreamLiveDataPage() {
    return (
        <AbstractStreamPage>
            <StreamModifier>
                <UnwrappedStreamEditPage />
            </StreamModifier>
        </AbstractStreamPage>
    )
}
