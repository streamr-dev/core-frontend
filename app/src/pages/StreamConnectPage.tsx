import React from 'react'
import { StreamPermission } from 'streamr-client'
import Display from '$shared/components/Display'
import useStreamPermissions from '$shared/hooks/useStreamPermissions'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import CodeSnippetsSection from './AbstractStreamEditPage/CodeSnippetsSection'
import StatusSection from './AbstractStreamEditPage/StatusSection'
import PreviewSection from './AbstractStreamEditPage/PreviewSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import ConfigSection from './AbstractStreamEditPage/ConfigSection'

function UnwrappedStreamEditPage() {
    const { busy } = useStreamModifierStatusContext()
    const { [StreamPermission.EDIT]: canEdit } = useStreamPermissions()
    const loading = typeof canEdit === 'undefined'
    return (
        <StreamPage loading={loading}>
            <div>Connect</div>
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
