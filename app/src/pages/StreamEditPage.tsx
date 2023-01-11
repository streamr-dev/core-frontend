import React from 'react'
import { StreamPermission } from 'streamr-client'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'

function UnwrappedStreamEditPage() {
    const { busy } = useStreamModifierStatusContext()
    const { [StreamPermission.EDIT]: canEdit } = useStreamPermissions()
    const title = canEdit ? 'Set up your stream' : 'Read only stream'
    const loading = typeof canEdit === 'undefined'
    return (
        <StreamPage title={title} loading={loading}>
            <InfoSection disabled={busy} />
            <AccessControlSection disabled={busy} />
            <HistorySection disabled={busy} />
            <PartitionsSection disabled={busy} />
        </StreamPage>
    )
}

export default function StreamCreatePage() {
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
