import React, { useState } from 'react'
import { StreamPermission } from 'streamr-client'
import { useHistory } from 'react-router-dom'

import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPreview from '$shared/components/StreamPreview'
import useStreamData from '$shared/hooks/useStreamData'
import useRequirePermittedEffect from '$shared/hooks/useRequirePermittedEffect'
import useStream from '$shared/hooks/useStream'
import useStreamId from '$shared/hooks/useStreamId'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'

function UnwrappedStreamEditPage() {
    const { busy } = useStreamModifierStatusContext()
    const { [StreamPermission.EDIT]: canEdit } = useStreamPermissions()
    const loading = typeof canEdit === 'undefined'
    const streamId = useStreamId()
    const stream = useStream()
    useRequirePermittedEffect(StreamPermission.SUBSCRIBE)
    const history = useHistory()
    const [partition, setPartition] = useState(0)
    const data = useStreamData(streamId, {
        tail: 20,
    })

    return (
        <StreamPage loading={loading}>
            <StreamPreview
                streamId={streamId}
                stream={stream}
                streamData={data}
                activePartition={partition}
                onPartitionChange={setPartition}
                loading={stream == null}
            />
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
