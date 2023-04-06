import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentAbility } from '../shared/stores/abilities'
import { useStreamModifierStatusContext } from '$shared/contexts/StreamModifierStatusContext'
import StreamPage from './StreamPage'
import AbstractStreamPage from './AbstractStreamPage'
import StreamModifier from './AbstractStreamEditPage/StreamModifier'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import DeleteSection from './AbstractStreamEditPage/DeleteSection'

function UnwrappedStreamEditPage() {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const canDelete = useCurrentAbility(StreamPermission.DELETE)

    const { busy } = useStreamModifierStatusContext()

    const loading = typeof canEdit === 'undefined'

    return (
        <StreamPage loading={loading}>
            <InfoSection disabled={busy} />
            <AccessControlSection disabled={busy} />
            <HistorySection disabled={busy} />
            <PartitionsSection disabled={busy} />
            {canDelete && (
                <DeleteSection />
            )}
        </StreamPage>
    )
}

export default function StreamCreatePage() {
    return (
        <AbstractStreamPage>
            <StreamModifier>
                <UnwrappedStreamEditPage />
            </StreamModifier>
        </AbstractStreamPage>
    )
}
