import React from 'react'
import { StreamPermission } from 'streamr-client'
import { useCurrentAbility } from '../shared/stores/abilities'
import StreamPage from './StreamPage'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import DeleteSection from './AbstractStreamEditPage/DeleteSection'
import useDecodedStreamId from '../shared/hooks/useDecodedStreamId'
import { StreamDraftContext, useInitStreamDraft, useIsCurrentDraftBusy } from '../shared/stores/streamEditor'
import PersistanceAlert from './AbstractStreamEditPage/PersistanceAlert'

function UnwrappedStreamEditPage() {
    const canEdit = useCurrentAbility(StreamPermission.EDIT)

    const canDelete = useCurrentAbility(StreamPermission.DELETE)

    const disabled = useIsCurrentDraftBusy()

    const loading = typeof canEdit === 'undefined'

    return (
        <StreamPage loading={loading}>
            <PersistanceAlert />
            <InfoSection disabled={disabled} />
            <AccessControlSection disabled={disabled} />
            <HistorySection disabled={disabled} />
            <PartitionsSection disabled={disabled} />
            {canDelete && (
                <DeleteSection />
            )}
        </StreamPage>
    )
}

export default function StreamEditPage() {
    return (
        <StreamDraftContext.Provider value={useInitStreamDraft(useDecodedStreamId())}>
            <UnwrappedStreamEditPage />
        </StreamDraftContext.Provider>
    )
}
