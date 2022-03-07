import React, { useState } from 'react'
import { StreamPermission } from 'streamr-client'
import { useHistory } from 'react-router-dom'
import ModalDialog from '$shared/components/ModalDialog'
import StreamPreview from '$shared/components/StreamPreview'
import useStreamData from '$shared/hooks/useStreamData'
import routes from '$routes'
import AbstractStreamPage from './AbstractStreamPage'
import useRequirePermittedEffect from './AbstractStreamPage/hooks/useRequirePermittedEffect'
import useStream from './AbstractStreamPage/hooks/useStream'
import useStreamId from './AbstractStreamPage/hooks/useStreamId'

function StreamInspectorPage() {
    const streamId = useStreamId()

    const stream = useStream()

    useRequirePermittedEffect(StreamPermission.SUBSCRIBE)

    const history = useHistory()

    const [partition, setPartition] = useState(0)

    const data = useStreamData(streamId)

    return (
        <ModalDialog onClose={() => {}} fullpage noScroll>
            <StreamPreview
                streamId={streamId}
                stream={stream}
                streamData={data}
                activePartition={partition}
                onPartitionChange={setPartition}
                onClose={() => history.replace(routes.streams.show({
                    id: streamId,
                }))}
                loading={stream == null}
            />
        </ModalDialog>
    )
}

export default function StreamInspectorPageWrapper() {
    return (
        <AbstractStreamPage streamOperations={[StreamPermission.SUBSCRIBE]}>
            <StreamInspectorPage />
        </AbstractStreamPage>
    )
}
