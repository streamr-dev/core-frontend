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
import { Route, Switch } from 'react-router-dom'
import { StreamPreview } from '$shared/components/StreamPreview'
import { StreamConnect } from '$shared/components/StreamConnect'
import routes from '$routes'

function EditPage() {
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
            {canDelete && <DeleteSection />}
        </StreamPage>
    )
}

function LiveDataPage() {
    const canSubscribe = useCurrentAbility(StreamPermission.SUBSCRIBE)

    const loading = typeof canSubscribe === 'undefined'

    const streamId = useDecodedStreamId()

    return (
        <StreamPage loading={loading} includeContainerBox={false} showSaveButton={false}>
            <StreamPreview streamsList={[streamId]} previewDisabled={!canSubscribe} />
        </StreamPage>
    )
}

function ConnectPage() {
    const streamId = useDecodedStreamId()

    const loading = typeof useCurrentAbility(StreamPermission.EDIT) === 'undefined'

    return (
        <StreamPage loading={loading} showSaveButton={false} fullWidth>
            <StreamConnect streams={[streamId]} />
        </StreamPage>
    )
}

export default function StreamEditPage() {
    return (
        <StreamDraftContext.Provider value={useInitStreamDraft(useDecodedStreamId())}>
            <Switch>
                <Route exact path={routes.streams.overview()} component={EditPage} key="EditPage" />,
                <Route exact path={routes.streams.connect()} component={ConnectPage} key="ConnectPage" />,
                <Route exact path={routes.streams.liveData()} component={LiveDataPage} key="LiveDataPage" />,
            </Switch>
        </StreamDraftContext.Provider>
    )
}
