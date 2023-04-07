import React from 'react'
import StreamPage from './StreamPage'
import InfoSection from './AbstractStreamEditPage/InfoSection'
import AccessControlSection from './AbstractStreamEditPage/AccessControlSection'
import HistorySection from './AbstractStreamEditPage/HistorySection'
import PartitionsSection from './AbstractStreamEditPage/PartitionsSection'
import { useInitStreamDraft, StreamDraftContext, useIsCurrentDraftBusy } from '../shared/stores/streamEditor'

function UnwrappedStreamCreatePage() {
    const disabled = useIsCurrentDraftBusy()

    return (
        <StreamPage showSaveButton={false} fullWidth={false}>
            <InfoSection disabled={disabled} />
            <AccessControlSection disabled={disabled} />
            <HistorySection disabled={disabled} />
            <PartitionsSection disabled={disabled} />
        </StreamPage>
    )
}

export default function StreamCreatePage() {
    return (
        <StreamDraftContext.Provider value={useInitStreamDraft(undefined)}>
            <UnwrappedStreamCreatePage />
        </StreamDraftContext.Provider>
    )
}
