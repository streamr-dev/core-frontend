import React from 'react'
import { StreamPermission } from 'streamr-client'
import { StreamPreview } from '$shared/components/StreamPreview'
import { useCurrentAbility } from '../shared/stores/abilities'
import StreamPage from './StreamPage'
import useDecodedStreamId from '../shared/hooks/useDecodedStreamId'
import { StreamDraftContext, useInitStreamDraft } from '../shared/stores/streamEditor'

function UnwrappedStreamLiveDataPage() {
    const canSubscribe = useCurrentAbility(StreamPermission.SUBSCRIBE)

    const loading = typeof canSubscribe === 'undefined'

    const streamId = useDecodedStreamId()

    return (
        <StreamPage loading={loading} includeContainerBox={false} showSaveButton={false}>
            <StreamPreview streamsList={[streamId]} previewDisabled={!canSubscribe} />
        </StreamPage>
    )
}

export default function StreamLiveDataPage() {
    return (
        <StreamDraftContext.Provider value={useInitStreamDraft(useDecodedStreamId())}>
            <UnwrappedStreamLiveDataPage />
        </StreamDraftContext.Provider>
    )
}
